export type Metadata = {
  name: string;
  description: string;
  image: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
  hidden: {
    trait_type: string;
    value: string;
  }[];
  tokenId: number;
};
