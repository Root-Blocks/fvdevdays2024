import jwt, { JwtPayload } from "jsonwebtoken";
import jwkToPem from "jwk-to-pem";
import { logger } from "./logger";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

const log = logger.child({ module: "verifyToken" });

export async function verifyCookie(
  cookieStore: ReadonlyRequestCookies
): Promise<JwtPayload | null> {
  try {
    const cookie = cookieStore.get(process.env.AUTH_COOKIE_NAME);

    if (!cookie) {
      return null;
    }

    const idToken = JSON.parse(cookie.value)["id_token"];
    const jwk = await fetchJwk();

    if (!jwk) {
      return null;
    }

    const publicKey = jwkToPem(jwk.keys[0]);

    const payload = jwt.verify(idToken, publicKey, {
      algorithms: ["RS256"],
    });

    return payload as JwtPayload;
  } catch (err) {
    log.error(
      {
        error: err,
      },
      "Error verifying token"
    );
    return null;
  }
}

async function fetchJwk() {
  try {
    const res = await fetch(`${process.env.FUTUREPASS_JWK_URL}`);
    const jwk = await res.json();
    return jwk;
  } catch (err) {
    log.error(
      {
        error: err,
      },
      "Error fetching JWK"
    );
  }
  return null;
}
