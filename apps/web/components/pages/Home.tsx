"use client";
import React, { useState } from "react";

import { MintCard } from "../organisms/MintCard";

import { NavBar } from "../molecules/NavBar";
import { ToDoList } from "../organisms/ToDoList";
import { NftList } from "../organisms/NftList";

export const Home = () => {
  const [tab, setTab] = useState<"nfts" | "todos">("todos");

  return (
    <div className="h-screen w-screen overflow-hidden">
      <NavBar selectedTab={tab} onTabChange={setTab} />
      <div className="h-screen w-screen px-20 py-12">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div className="lg:col-span-4">
            {tab === "todos" ? <ToDoList /> : <NftList />}
          </div>
          <div className="md:col-span-1">
            <MintCard />
          </div>
        </div>
      </div>
    </div>
  );
};
