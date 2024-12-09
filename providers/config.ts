import { createWagmiConfig } from "@futureverse/auth-react/wagmi";
import { QueryClient } from "@tanstack/react-query";
import { cookieStorage, createStorage } from "wagmi";
import { FutureverseAuthClient } from "@futureverse/auth-react/auth";

const clientId = process.env.NEXT_PUBLIC_FUTUREVERSE_CLIENT_ID!;

export const authClient = new FutureverseAuthClient({
  clientId,
  environment:
    process.env.NEXT_PUBLIC_ENV !== "prod" ? "staging" : "production",
  redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI,
});

export const queryClient = new QueryClient();

export const getWagmiConfig = () => {
  return createWagmiConfig({
    authClient,
    ssr: true,
    storage: createStorage({
      storage: cookieStorage,
    }),
  });
};
