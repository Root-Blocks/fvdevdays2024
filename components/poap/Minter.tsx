import { UserSession } from "@futureverse/auth-react/auth";
import { useState } from "react";
import LoadingSpinner from "../ui/LoadingSpinner";
import { Metadata } from "@/types/metadata";

export default function Minter({
  userSession,
  updateMetadata,
}: {
  userSession: UserSession;
  updateMetadata: (metadata: Metadata) => void;
}) {
  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mintNft = async () => {
    if (isMinting) return;
    setIsMinting(true);
    setError(null);

    try {
      const res = await fetch("/api/mint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          who: userSession?.futurepass,
        }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        console.debug("Mint response: ", data);
        updateMetadata(data.metadata);
      }
    } catch (error) {
      console.error(error);
      setError("Unfortunately, we couldn't mint your NFT. Please try again.");
    } finally {
      setIsMinting(false);
    }
  };
  return (
    <div className="bg-white">
      {isMinting ? (
        <LoadingSpinner />
      ) : (
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              Mint your POAP
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-lg/8 text-gray-600">
              An exclusive POAP for the Futureverse Developer Days 2024 event in
              Paris hosted by XRPL Commons.
            </p>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-lg/8 text-gray-600">
              <strong>What is a POAP?</strong>
              <br /> A POAP or Proof of Attendance Protocol refers to
              non-fungible tokens (NFTs) that prove a person has attended a
              certain event.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={() => mintNft()}
                disabled={isMinting}
                className="justify-center w-36 rounded-md bg-rb-black px-2 py-1 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-rb-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rb-black"
              >
                Let&apos;s mint
              </button>
            </div>
            {error && (
              <div className="mt-4 text-red-600 text-sm">
                <p>{error}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
