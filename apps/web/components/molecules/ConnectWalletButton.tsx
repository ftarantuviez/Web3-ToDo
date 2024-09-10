"use client";

import { Button } from "@ui/components/Button";
import { Wallet2Icon } from "lucide-react";
import { useMemo } from "react";
import {
  useAccount,
  useBalance,
  useDisconnect,
  useReadContract,
  useReadContracts,
  useSwitchChain,
} from "wagmi";
import { ChainId } from "@repo/common/src/ChainId";
import { useUserToken } from "../../hooks/useUserToken";
import { Address } from "@repo/common/src/Address";
import { useRouter } from "next/navigation";

type WalletAccountInfoState = Readonly<
  "connected" | "disconnected" | "wrong-network" | "loading"
>;

/**
 * `ConnectWalletButton` component.
 *
 * This component handles the custom wallet connection button using RainbowKit.
 * It provides a customizable interface for connecting to Ethereum wallets.
 *
 * @see https://www.rainbowkit.com/docs/custom-connect-button for more information about RainbowKit.
 */
export const ConnectWalletButton = () => {
  const { address, isConnecting, isConnected, isReconnecting, chainId, chain } =
    useAccount();
  const router = useRouter();

  const { disconnectAsync } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const token = useUserToken(
    Address.ofStringOrThrow("0xf02f35bF1C8D2c3a1e7255FD9AddC8F2182e0627")
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
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">
            {Address.truncate(Address.ofStringOrThrow(address!))}
          </span>
          <span className="text-sm font-medium">
            {token?.balanceFormatted} {token?.symbol}
          </span>
          <Button variant="outline" size="sm">
            {chain?.name ?? "Unknown"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              disconnectAsync().then(() => {
                router.refresh();
              });
            }}
          >
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
      return (
        <Button>
          <Wallet2Icon className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      );
  }
};
