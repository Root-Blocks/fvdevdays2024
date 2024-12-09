declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_ENV: "local" | "dev" | "prod";
      NEXT_PUBLIC_FUTUREVERSE_CLIENT_ID: string;
      NEXT_PUBLIC_METADATA_URL: string;
      NEXT_PUBLIC_COLLECTION_ID: string;
      NEXT_PUBLIC_NETWORK: "root" | "porcini";
      NEXT_PUBLIC_REDIRECT_URI: string;
      PRIVATE_KEY: string;
      S3_BUCKET: string;
      AWS_ACCESS_KEY_ID: string;
      AWS_SECRET_ACCESS_KEY: string;
      AWS_REGION: string;
      AUTH_COOKIE_NAME: string;
      FUTUREPASS_JWK_URL: string;
    }
  }
}

export {};
