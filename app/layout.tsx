import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import AuthProviders from "@/providers/authProviders";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { getWagmiConfig } from "@/providers/config";
import { ApiProvider } from "@/providers/apiProvider";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Rootblocks | Futureverse Dev Days Paris 2024 POAP Collection",
  description:
    "Mint your exclusive NFT for the Futureverse Dev Days 2024 event in Paris, France.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(
    await getWagmiConfig(),
    headers().get("cookie")
  );
  return (
    <html lang="en" className="h-full bg-white">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />

        <link rel="icon" href="/favicon/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#f7fdc4" />
      </head>
      <body className={`${outfit.variable} font-sans antialiased h-full`}>
        <ApiProvider>
          <AuthProviders initialWagmiState={initialState}>
            {children}
          </AuthProviders>
        </ApiProvider>
      </body>
    </html>
  );
}
