import React from "react";
import { ThemeToggle } from "./ThemeToggle";
import Image from "next/image";
import { FadeInScaleAnimation } from "@ui/components/FadeInScaleAnimation";
import { Separator } from "@ui/components/Separator";
import { ConnectWalletButton } from "../web3/ConnectWalletButton";
import { Tabs, TabsList, TabsTrigger } from "@ui/components/Tabs";

export const NavBar: React.FunctionComponent<
  Readonly<{
    selectedTab: "todos" | "nfts";
    onTabChange: (tab: "todos" | "nfts") => void;
  }>
> = ({ selectedTab, onTabChange }) => {
  return (
    <div className="w-screen flex items-center justify-between p-7 border-b">
      <div className="flex items-center gap-5">
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
        <Separator orientation="vertical" className="h-10 mx-4" />
        <Tabs
          defaultValue="todos"
          value={selectedTab}
          onValueChange={(value) => onTabChange(value as "todos" | "nfts")}
        >
          <TabsList>
            <TabsTrigger value="todos">TODOS</TabsTrigger>
            <TabsTrigger value="nfts">NFTS</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="flex items-center gap-4">
        <FadeInScaleAnimation duration="1">
          <ConnectWalletButton />
        </FadeInScaleAnimation>
        <ThemeToggle />
      </div>
    </div>
  );
};
