"use client";

import {
  FutureverseAuthProvider,
  FutureverseWagmiProvider,
} from "@futureverse/auth-react";
import { QueryClientProvider } from "@tanstack/react-query";
import { State } from "wagmi";
import { authClient, getWagmiConfig, queryClient } from "./config";
import { AuthUiProvider, LightTheme } from "@futureverse/auth-ui";

export default function AuthProviders({
  children,
  initialWagmiState,
}: {
  children: React.ReactNode;
  initialWagmiState?: State;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <FutureverseWagmiProvider
        getWagmiConfig={getWagmiConfig}
        initialState={initialWagmiState}
      >
        <FutureverseAuthProvider authClient={authClient}>
          <AuthUiProvider themeConfig={LightTheme} authClient={authClient}>
            {children}
          </AuthUiProvider>
        </FutureverseAuthProvider>
      </FutureverseWagmiProvider>
    </QueryClientProvider>
  );
}
