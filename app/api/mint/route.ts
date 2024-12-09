import { createKeyring } from "@/lib/trn/createKeyring";
import { filterExtrinsicEvents } from "@/lib/trn/filterExtrinsicEvents";
import { formatEventData } from "@/lib/trn/formatEventData";
import { generateMetadata } from "@/lib/metadata/generateMetadata";
import { getChainApi } from "@/lib/trn/getChainApi";
import { logger } from "@/lib/logger";
import { sendExtrinsic } from "@/lib/trn/sendExtrinsic";
import { uploadMetadata } from "@/lib/metadata/uploadMetadata";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyCookie } from "@/lib/verifyToken";
import { Metadata } from "@/types/metadata";

const log = logger.child({ route: "mint" });

type MintNftResponse = {
  extrinsicId: string;
  blockNumber: number | undefined;
  mintEvent: Record<string, { type: string; value: unknown }>;
  tokenId: number;
  metadata: Metadata;
};

export const maxDuration = 60;

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json();

  // Make sure we only handle authenticated requests
  const cookieStore = cookies();

  const jwtPayload = await verifyCookie(cookieStore);

  if (!jwtPayload || jwtPayload.futurepass !== body.who) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (process.env.NEXT_PUBLIC_MINT_IS_LIVE === "false") {
    return NextResponse.json(
      { error: "Mint is over for this collection." },
      { status: 400 }
    );
  }

  // Create an ApiPromise instance with the network
  const apiPromise = getChainApi(process.env.NEXT_PUBLIC_NETWORK);
  const [api, signer] = await Promise.all([
    apiPromise,
    createKeyring(process.env.PRIVATE_KEY),
  ]);

  log.debug(
    `Created API instance with network="${process.env.NEXT_PUBLIC_NETWORK}"`
  );
  log.debug(
    `Created Signer instance from a private key of address="${signer.address}"`
  );

  // Make sure the FuturePass account does not own any NFTs of the collection

  const ownedTokens = await api.rpc.nft.ownedTokens(
    process.env.NEXT_PUBLIC_COLLECTION_ID,
    body.who,
    0,
    1
  );

  const ownedTokenIds = ownedTokens.toJSON()[2] as number[];

  if (ownedTokenIds.length > 0) {
    log.error("FuturePass account already owns an NFT");
    return NextResponse.json(
      { error: "FuturePass account already owns an NFT" },
      { status: 400 }
    );
  }

  // Retrieve the FuturePass account of the signer
  const fpAccount = (
    await api.query.futurepass.holders(signer.address)
  ).unwrapOr(undefined);

  if (!fpAccount) {
    log.error("FuturePass account not found");
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }

  // Create a "nft.mint" extrinsic
  const quantity = 1;
  const tokenOwner = body.who;
  const collectionId = process.env.NEXT_PUBLIC_COLLECTION_ID;

  const call = api.tx.nft.mint(collectionId, quantity, tokenOwner);

  // Proxy the extrinsic through FuturePass
  const extrinsic = api.tx.futurepass.proxyExtrinsic(fpAccount, call);

  log.info(`Dispatch extrinsic from caller="${signer.address}"`);

  try {
    // Sign and send the extrinsic
    const { result, extrinsicId } = await sendExtrinsic(extrinsic, signer, {
      log,
    });

    // Retrieve the mint event from the extrinsic result
    const [mintEvent] = filterExtrinsicEvents(result.events, ["Nft.Mint"]);
    const mintEventFormatted = formatEventData(mintEvent.event);
    log.info(
      {
        result: {
          extrinsicId,
          blockNumber: result.blockNumber,
          mintEvent: mintEventFormatted,
          txHash: result.txHash,
        },
      },
      "Received result"
    );

    // Retrieve the tokenId from the mint event
    const tokenId = mintEventFormatted.start.value as number;

    // Generate and upload metadata
    const metadata = generateMetadata(tokenId, result.txHash.toString());
    logger.debug({ metadata }, "Generated metadata");

    await uploadMetadata(tokenId, metadata);
    logger.debug({ tokenId }, "Metadata uploaded");

    return NextResponse.json<MintNftResponse>({
      extrinsicId,
      blockNumber: result.blockNumber?.toNumber(),
      mintEvent: formatEventData(mintEvent.event),
      tokenId: tokenId,
      metadata: metadata,
    });
  } catch (e) {
    log.error(e);
    return NextResponse.json(
      { error: "Encountered an error while sending." },
      { status: 500 }
    );
  } finally {
    await api.disconnect();
  }
}
