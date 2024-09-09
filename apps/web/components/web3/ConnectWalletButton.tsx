"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@ui/components/Button";
import { Wallet2Icon } from "lucide-react";

/**
 * `ConnectWalletButton` component.
 *
 * This component handles the custom wallet connection button using RainbowKit.
 * It provides a customizable interface for connecting to Ethereum wallets.
 *
 * @see https://www.rainbowkit.com/docs/custom-connect-button for more information about RainbowKit.
 */
export const ConnectWalletButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");
        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              // If the user is not connected, show the connect button.
              if (!connected) {
                return (
                  <Button
                    onClick={openConnectModal}
                    variant="default"
                    className="flex items-center gap-2"
                  >
                    <Wallet2Icon className="h-4 w-4" />
                    Connect Wallet
                  </Button>
                );
              }
              // In the case network is not supported,
              // UI must be clear about the network issue.
              if (chain.unsupported) {
                return (
                  <Button onClick={openChainModal} variant="destructive">
                    Wrong network
                  </Button>
                );
              }
              // We display the connected account, chain, and balance.
              return (
                <div className="flex gap-2">
                  <Button
                    onClick={openChainModal}
                    variant="outline"
                    className="flex items-center"
                  >
                    {chain.name}
                  </Button>
                  <Button onClick={openAccountModal} variant="secondary">
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ""}
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
