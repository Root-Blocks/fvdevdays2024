"use client";
import { getMetadata } from "@/lib/metadata/getMetadata";
import { Metadata } from "@/types/metadata";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const Viewer = dynamic(() => import("@/components/poap/Viewer"), {
  ssr: false,
});

export default function PublicViewer() {
  const params = useParams<{ tokenId: string }>();
  const [metadata, setMetadata] = useState<Metadata | null>(null);

  useEffect(() => {
    (async () => {
      const metadata = await getMetadata(parseInt(params.tokenId));
      setMetadata(metadata);
    })();
  }, []);

  return (
    <div className="px-4 sm:px-12 xl:px-48 lg:py-12">
      {metadata && <Viewer metadata={metadata} hideButton={true} />}
    </div>
  );
}
