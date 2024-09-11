"use client";

import { Button } from "@ui/components/Button";
import { LogOutIcon } from "lucide-react";
import React, { useMemo } from "react";
import { useAccount, useDisconnect, useSwitchChain } from "wagmi";
import { ChainId } from "@repo/common/src/ChainId";
import { useUserToken } from "../../hooks/useUserToken";
import { Address } from "@repo/common/src/Address";
import { useRouter } from "next/navigation";
import { getContractAddress } from "../../config/getContractAddress";
import { signOut } from "next-auth/react";
import { DotLoader } from "react-spinners";

type WalletAccountInfoState = Readonly<
  "connected" | "disconnected" | "wrong-network" | "loading"
>;

/**
 * WalletAccountInfo Component
 *
 * This component displays information about the user's wallet connection status
 * and account details when connected. It handles different states of wallet
 * connection and provides appropriate UI for each state.
 *
 * States:
 * - Connected: Shows the truncated wallet address, token balance, network name, and a disconnect button.
 * - Disconnected: Likely shows a connect wallet button (not visible in the provided code snippet).
 * - Wrong Network: Probably shows a prompt to switch to the correct network (not visible in the provided code snippet).
 * - Loading: Likely shows a loading indicator (not visible in the provided code snippet).
 *
 * The component uses various hooks from wagmi for wallet interactions:
 * - useAccount: To get the current account status and details.
 * - useDisconnect: To handle wallet disconnection.
 * - useSwitchChain: To handle network switching (though not used in the visible part of the code).
 *
 * It also uses a custom hook useUserToken to fetch and display the user's token balance.
 */
export const WalletAccountInfo: React.FunctionComponent = () => {
  const { address, isConnecting, isConnected, isReconnecting, chainId, chain } =
    useAccount();
  const router = useRouter();

  const { disconnectAsync } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const { data: token } = useUserToken(
    getContractAddress(ChainId.POLYGON_AMOY).erc20
  );

  const walletAccountInfoState = useMemo<WalletAccountInfoState>(() => {
    if (isConnecting || isReconnecting) return "loading";
    if (isConnected) {
      // This is only for type safety.
      // User always has a chainId when connected.
      if (!chainId) {
        throw new Error("Chain ID is not available");
      }

      if (ChainId.ofNumericOrThrow(chainId) !== ChainId.POLYGON_AMOY)
        return "wrong-network";
      return "connected";
    }
    return "disconnected";
  }, [isConnecting, isConnected, isReconnecting, chainId]);

  switch (walletAccountInfoState) {
    case "connected":
      return (
        <div className="flex items-center space-x-4 bg-background border border-border p-3 rounded-lg shadow-lg">
          <div className="flex flex-col items-start">
            <span className="text-sm font-bold">
              {Address.truncate(Address.ofStringOrThrow(address!))}
            </span>
            <span className="text-xs text-muted-foreground">
              {token?.balanceFormatted} {token?.symbol}
            </span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="text-purple-600 hover:bg-gray-100 transition-colors duration-200"
          >
            {chain?.name ?? "Unknown"}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="bg-red-500 hover:bg-red-600 text-white transition-colors duration-200"
            onClick={() => {
              disconnectAsync().then(async () => {
                await signOut();
              });
            }}
          >
            <LogOutIcon className="mr-2 h-4 w-4" />
            Disconnect
          </Button>
        </div>
      );
    case "wrong-network":
      return (
        <Button
          variant="destructive"
          onClick={() => switchChain({ chainId: Number(ChainId.POLYGON_AMOY) })}
        >
          Switch to Polygon Amoy
        </Button>
      );
    case "disconnected":
    case "loading":
    default:
      return <DotLoader color="#4B5563" size={20} />;
  }
};
