import { Metadata } from "@/types/metadata";

export const getMetadata = async (tokenId: number) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_METADATA_URL}${tokenId.toString()}`
  );

  const metadata = await res.json();
  return metadata as Metadata;
};
