import { useContext } from "react";
import ApiContext from "@/providers/apiProvider";
import { useQuery } from "@tanstack/react-query";
import { getMetadata } from "@/lib/metadata/getMetadata";

export default function usePoap({
  collectionId,
  fpAddress,
}: {
  collectionId: string;
  fpAddress: string;
}) {
  const { api, isReady } = useContext(ApiContext);

  return useQuery({
    queryKey: ["assets", collectionId, fpAddress],
    queryFn: async () => {
      if (!api || !isReady) return null;

      const data = await api.rpc.nft.ownedTokens(
        collectionId,
        fpAddress,
        0,
        100
      );

      const ids = data.toJSON()[2] as number[];
      console.debug("Token IDs: ", ids);

      if (ids.length === 0) {
        return {
          tokenId: null,
          metadata: null,
        };
      }
      const tokenId = ids[ids.length - 1];
      const metadata = await getMetadata(ids[ids.length - 1]);

      console.debug(`Metadata for ${tokenId}: `, metadata);

      return {
        tokenId: ids[ids.length - 1],
        metadata,
      };
    },
    staleTime: Infinity,
  });
}
