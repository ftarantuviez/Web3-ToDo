"use client";
import {
  FunctionComponent,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { cn } from "@ui/lib/utils";

import { CheckCircle, CoinsIcon, XCircle } from "lucide-react";
import { Button } from "@ui/components/Button";
import { useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { wagmiConfig } from "../../contexts/AuthProvider";
import { useWriteERC721Contract } from "../../hooks/useWriteERC721Contract";
import { getContractAddress } from "../../config/getContractAddress";
import { ChainId } from "@repo/common/src/ChainId";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../packages/ui/src/components/Select";
import { toast } from "../../../../packages/ui/src/components/Toaster";
import { useToDo } from "../../contexts/ToDoProvider";
import { useUserNfts } from "../../hooks/useUserNfts";
import { PendingTransactionModal } from "./PendingTransactionModal";
import { Address } from "@repo/common/src/Address";

export const MintCard: FunctionComponent = () => {
  const { todos } = useToDo();
  const { data: userNfts } = useUserNfts(
    getContractAddress(ChainId.POLYGON_AMOY).nft
  );

  const { writeERC721Contract } = useWriteERC721Contract();
  const [confirmations, setConfirmations] = useState<number>(2);
  const [transactionHash, setTransactionHash] = useState<
    `0x${string}` | undefined
  >(undefined);
  const [isPending, setIsPending] = useState<boolean>(false);

  const handleMint = useCallback(async () => {
    try {
      setIsPending(true);
      const hash = await writeERC721Contract({
        address: getContractAddress(ChainId.POLYGON_AMOY).nft,
        methodName: "mint",
      });
      if (hash) {
        setTransactionHash(hash);
        // We wait for the receipt of the transaction to check if it was successful.
        const receipt = await waitForTransactionReceipt(wagmiConfig, {
          hash,
          confirmations,
        });
        if (receipt.status === "success") {
          toast.success("NFT minted successfully");
        } else toast.error("NFT minting reverted");
      }

      setConfirmations(2);
      setTransactionHash(undefined);
    } catch (error) {
      toast.error("There was an error minting the NFT");
    } finally {
      setIsPending(false);
    }
  }, [writeERC721Contract]);

  // THIS MATH IS INCORRECT, AND MIGHT HAVE CASES WHERE IT DOESN'T WORK.
  // IT JUST FOR THE SAKE OF THE CHALLENGE.
  const eligibleTodos = useMemo(() => {
    // We calculate the number of eligible todos based on the number of NFTs the user has
    // and the number of completed todos.
    const completedTodos = todos.filter((todo) => todo.completed).length;
    const totalNfts = userNfts?.length || 0;
    return completedTodos - totalNfts * 2;
  }, [userNfts, todos]);

  const canMint = useMemo(() => {
    return eligibleTodos >= 2;
  }, [eligibleTodos]);

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
            <div className="flex flex-col items-center space-y-4">
              <Select
                onValueChange={(value) => setConfirmations(Number(value))}
                defaultValue="2"
              >
                <SelectTrigger className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-colors mb-8">
                  <SelectValue placeholder="Select confirmations" />
                </SelectTrigger>
                <SelectContent className="bg-purple-900/90 backdrop-blur-sm border-white/20 text-white">
                  {[...Array(65)].map((_, i) => (
                    <SelectItem
                      key={i}
                      value={i.toString()}
                      className="hover:bg-white/10 transition-colors"
                    >
                      {i} confirmation{i !== 1 ? "s" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 rounded-md shadow-lg transition-all duration-300 transform hover:scale-105 hover:rotate-1 animate-pulse cursor-pointer w-40 py-6"
                onClick={handleMint}
              >
                <CoinsIcon className="w-5 h-5 animate-bounce" />
                <span className="animate-bounce font-bold">Mint NFT</span>
              </Button>
            </div>
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
                  eligibleTodos >= 1 ? "text-green-400" : "text-gray-400"
                )}
              />
              <CheckCircle className="w-6 h-6 text-gray-400" />
            </div>
            <Button disabled className="mt-4 opacity-50 cursor-not-allowed">
              <XCircle className="w-4 h-4 mr-2" />
              Minting Locked
            </Button>
          </>
        )}
      </div>
      <PendingTransactionModal
        isOpen={isPending}
        transactionHash={transactionHash}
      />
    </div>
  );
};
