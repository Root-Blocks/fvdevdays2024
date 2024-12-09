"use client";
import { useAuth } from "@futureverse/auth-react";
import { useAuthUi } from "@futureverse/auth-ui";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { openLogin } = useAuthUi();
  const { userSession, isFetchingSession } = useAuth();
  const router = useRouter();
  const mintIsLive = process.env.NEXT_PUBLIC_MINT_IS_LIVE === "true";

  useEffect(() => {
    if (userSession && !isFetchingSession) {
      router.push("/app");
    }
  }, [userSession, isFetchingSession]);

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            alt="Rootblocks Logo"
            src="/images/logo.png"
            className="mx-auto h-10 w-auto rounded-md"
            width={40}
            height={40}
          />
          <p className="mt-4 text-center text-lg font-medium leading-9 tracking-tight text-gray-800">
            POAP for the Futureverse Dev Days
          </p>
          <p className="text-center text-md font-light leading-9 tracking-tight text-gray-800">
            November 5th 2024, Paris, France @ XRPL Commons
          </p>
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Login to {mintIsLive ? "mint" : "view"} your POAP
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6">
            <div>
              <button
                disabled={isFetchingSession}
                onClick={() => openLogin()}
                className="justify-center w-full rounded-md h-16 bg-rb-black px-2 py-1 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-rb-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rb-black"
              >
                {isFetchingSession ? (
                  "Loading..."
                ) : (
                  <>
                    {" "}
                    Login with
                    <img
                      className="inline-flex -mt-0.5 w-16 h-16 justify-center align-middle"
                      src="/images/fvicon_cta.svg"
                    />{" "}
                  </>
                )}
              </button>
            </div>
          </div>
          <p className="mt-10 text-center text-sm text-gray-500">
            Reach out to us at{" "}
            <a
              href="mailto:we@craft-clarity.com"
              className="font-semibold leading-6 text-rb-black hover:text-rb-black/80"
            >
              we@craft-clarity.com
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
