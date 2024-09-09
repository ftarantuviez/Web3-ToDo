import React from "react";
import { ThemeToggle } from "./ThemeToggle";
import Image from "next/image";
import { FadeInScaleAnimation } from "@ui/components/FadeInScaleAnimation";
import { Separator } from "@ui/components/Separator";
import { ConnectWalletButton } from "../web3/ConnectWalletButton";

export const NavBar: React.FunctionComponent = () => {
  return (
    <div className="w-screen flex items-center justify-between p-7 border-b">
      <div className="flex items-center gap-2">
        <Image
          src="/mode-mobile-logo.png"
          alt="Logo"
          width={100}
          height={100}
        />
        <Separator orientation="vertical" className="h-10 mx-4" />
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text animate-gradient">
            TODO DApp
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
            Organize your tasks with blockchain
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <FadeInScaleAnimation duration="1">
          <ConnectWalletButton />
        </FadeInScaleAnimation>
        <ThemeToggle />
      </div>
    </div>
  );
};
