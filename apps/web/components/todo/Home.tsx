"use client";
import React, { useState } from "react";
import { NavBar } from "../ui/NavBar";
import { ToDoList } from "./ToDoList";
import { MintCard } from "../web3/MintCard";

export const Home = () => {
  const [tab, setTab] = useState<"nfts" | "todos">("todos");
  return (
    <>
      <NavBar selectedTab={tab} onTabChange={setTab} />
      <div className="h-screen w-screen px-20 py-12">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div className="lg:col-span-4">
            <ToDoList />
          </div>
          <div className="md:col-span-1">
            <MintCard completedTodos={1} />
          </div>
        </div>
      </div>
    </>
  );
};
