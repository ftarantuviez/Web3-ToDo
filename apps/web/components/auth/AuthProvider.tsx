"use client";

import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { Config, http, WagmiProvider } from "wagmi";
import { polygonAmoy } from "wagmi/chains";
import { FC, PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import {
  RainbowKitSiweNextAuthProvider,
  GetSiweMessageOptions,
} from "@rainbow-me/rainbowkit-siwe-next-auth";
import { Session } from "next-auth";

export const wagmiConfig: Config = getDefaultConfig({
  appName: "ModeMobile - ToDo Rewards",
  projectId: process.env["NEXT_PUBLIC_WALLET_CONNECT_CLIENT_ID"] ?? "",
  chains: [polygonAmoy],
  ssr: true,
  transports: {
    [polygonAmoy.id]: http("https://polygon-amoy-bor-rpc.publicnode.com"),
  },
});
export type SupportedChainIds = (typeof wagmiConfig.chains)[number]["id"];

const queryClient = new QueryClient();
const url = new URL(process.env.NEXT_PUBLIC_NEXTAUTH_URL as string);
const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: "ModeMobile - ToDo Rewards",
  domain: url.host,
});

/**
 * `AuthProvider` is a context provider that wraps the entire application.
 *
 * It provides the following contexts:
 *
 * - `WagmiProvider` from `wagmi` for blockchain data
 * - `QueryClientProvider` from `react-query` for data fetching
 * - `RainbowKitProvider` from `rainbowkit` for UI components
 * - `RainbowKitSiweNextAuthProvider` from `rainbowkit-siwe-next-auth` for authentication
 * - `SessionProvider` from `next-auth/react` for session management
 */
export const AuthProvider: FC<PropsWithChildren & { session?: Session }> = ({
  children,
  session,
}) => {
  return (
    <SessionProvider session={session}>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitSiweNextAuthProvider
            getSiweMessageOptions={getSiweMessageOptions}
          >
            <RainbowKitProvider theme={darkTheme()} showRecentTransactions>
              {children}
            </RainbowKitProvider>
          </RainbowKitSiweNextAuthProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </SessionProvider>
  );
};
