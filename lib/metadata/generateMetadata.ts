import { Metadata } from "@/types/metadata";

export const generateMetadata = (id: number, hash: string): Metadata => {
  return {
    name: `POAP Futureverse Dev Days Paris 2024`,
    description: `This artwork is part of the Futureverse Dev Days POAP collection, designed for the event in Paris, France on 5th Nov 2024.`,
    tokenId: id,
    image: `img/${id}.png`,
    attributes: [
      {
        trait_type: "Event",
        value: "Futureverse Dev Days",
      },
      {
        trait_type: "Country",
        value: "France",
      },
      {
        trait_type: "City",
        value: "Paris",
      },
    ],
    hidden: [
      {
        trait_type: "Hash",
        value: hash,
      },
    ],
  };
};
