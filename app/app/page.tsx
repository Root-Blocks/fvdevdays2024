"use client";
import Navbar from "@/components/partials/Navbar";
import Minter from "@/components/poap/Minter";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import usePoap from "@/hooks/usePoap";
import { Metadata } from "@/types/metadata";
import { useAuth } from "@futureverse/auth-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Viewer = dynamic(() => import("@/components/poap/Viewer"), {
  ssr: false,
});

export default function App() {
  const router = useRouter();
  const { userSession, isFetchingSession } = useAuth();
  const poap = usePoap({
    collectionId: process.env.NEXT_PUBLIC_COLLECTION_ID,
    fpAddress: userSession?.futurepass || "",
  });

  const mintIsLive = process.env.NEXT_PUBLIC_MINT_IS_LIVE === "true";

  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [isMinter, setIsMinter] = useState<boolean>(false);
  const [isViewer, setIsViewer] = useState<boolean>(false);

  useEffect(() => {
    if (!userSession && !isFetchingSession) {
      router.push("/");
    }
  }, [userSession, isFetchingSession]);

  useEffect(() => {
    if (poap.data?.metadata) {
      setMetadata(poap.data.metadata);
      setIsViewer(true);
    } else if (poap.data?.metadata === null) {
      setIsMinter(true);
    }
  }, [poap.data?.metadata]);

  const updateMetadata = (metadata: Metadata) => {
    setMetadata(metadata);
    setIsMinter(false);
    setIsViewer(true);
  };

  return (
    <div>
      <Navbar />
      {!userSession || isFetchingSession ? (
        <LoadingSpinner />
      ) : (
        <div className="px-4 sm:px-12 xl:px-48">
          {isViewer && metadata && <Viewer metadata={metadata} />}
          {isMinter && mintIsLive && (
            <Minter userSession={userSession} updateMetadata={updateMetadata} />
          )}

          {!mintIsLive && !isViewer && (
            <div className="text-center mt-12 px-12">
              You can&apos;t mint NFTs right now. <br /> The event is over and
              the minting is closed.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
