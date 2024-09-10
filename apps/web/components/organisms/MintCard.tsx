"use client";
import { FunctionComponent, useState, useEffect, useCallback } from "react";
import { cn } from "@ui/lib/utils";

import { CheckCircle, CoinsIcon, XCircle } from "lucide-react";
import { Button } from "@ui/components/Button";
import { useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { wagmiConfig } from "../../contexts/AuthProvider";

export const MintCard: FunctionComponent<{ completedTodos: number }> = ({
  completedTodos,
}) => {
  const [canMint, setCanMint] = useState(false);
  const { writeContractAsync } = useWriteContract();

  useEffect(() => {
    setCanMint(completedTodos >= 2);
  }, [completedTodos]);

  const handleMint = useCallback(async () => {
    const hash = await writeContractAsync({
      abi: [
        {
          inputs: [],
          name: "mint",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      address: "0x8E1096fd5C8Ca1EFdC1BC2F64Ae439E0888b1A46",
      functionName: "mint",
    });
    const receipt = await waitForTransactionReceipt(wagmiConfig, {
      hash,
      confirmations: 2,
    });
    console.log(receipt);
  }, [writeContractAsync]);

  return (
    <div
      className={cn(
        "relative w-full bg-gradient-to-br rounded-xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 h-[40vh]",
        canMint
          ? "from-purple-400 to-pink-500 animate-pulse"
          : "from-gray-400 to-gray-600"
      )}
    >
      <div className="absolute inset-0 bg-black opacity-30"></div>
      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 p-6">
        <h2
          className={cn(
            "text-3xl font-bold text-white mb-4 text-center",
            canMint && "animate-bounce"
          )}
        >
          {canMint ? "Mint Your NFT" : "Complete Tasks"}
        </h2>
        {canMint ? (
          <>
            <p className="text-white text-center mb-4">
              Congratulations! You have completed 2 tasks. You can now mint your
              NFT!
            </p>
            <Button
              className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 rounded-md shadow-lg transition-all duration-300 transform hover:scale-105 hover:rotate-1 animate-pulse cursor-pointer"
              onClick={handleMint}
            >
              <CoinsIcon className="w-5 h-5 animate-bounce" />
              <span className="animate-bounce font-bold">Mint NFT</span>
            </Button>
          </>
        ) : (
          <>
            <p className="text-white text-center mb-4">
              Complete 2 tasks to unlock NFT minting!
            </p>
            <div className="flex items-center space-x-2">
              <CheckCircle
                className={cn(
                  "w-6 h-6",
                  completedTodos >= 1 ? "text-green-400" : "text-gray-400"
                )}
              />
              <CheckCircle
                className={cn(
                  "w-6 h-6",
                  completedTodos >= 2 ? "text-green-400" : "text-gray-400"
                )}
              />
            </div>
            <Button disabled className="mt-4 opacity-50 cursor-not-allowed">
              <XCircle className="w-4 h-4 mr-2" />
              Minting Locked
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
