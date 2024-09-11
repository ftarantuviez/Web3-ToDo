import React, { useCallback, useState } from "react";
import { useUserNfts } from "../../hooks/useUserNfts";
import { Button } from "@ui/components/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/components/Card";
import { Separator } from "../../../../packages/ui/src/components/Separator";
import { FadeInScaleAnimation } from "../../../../packages/ui/src/components/FadeInScaleAnimation";
import { getContractAddress } from "../../config/getContractAddress";
import { ChainId } from "@repo/common/src/ChainId";
import { useWriteERC721Contract } from "../../hooks/useWriteERC721Contract";
import { toast } from "../../../../packages/ui/src/components/Toaster";
import { waitForTransactionReceipt } from "@wagmi/core";
import { wagmiConfig } from "../../contexts/AuthProvider";
import { PendingTransactionModal } from "./PendingTransactionModal";

export const NftList: React.FC = () => {
  const { writeERC721Contract } = useWriteERC721Contract();
  const {
    data: userNfts,
    isLoading,
    isError,
  } = useUserNfts(getContractAddress(ChainId.POLYGON_AMOY).nft);
  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);
  const [pending, setPending] = useState<boolean>(false);

  const handleBurn = useCallback(
    async (tokenId: number) => {
      try {
        setPending(true);
        const hash = await writeERC721Contract({
          address: getContractAddress(ChainId.POLYGON_AMOY).nft,
          methodName: "burn",
          args: { tokenId: BigInt(tokenId) },
        });

        if (hash) {
          setHash(hash);
          // We wait for the receipt of the transaction to check if it was successful.
          const receipt = await waitForTransactionReceipt(wagmiConfig, {
            hash,
          });
          if (receipt.status === "success") {
            toast.success("NFT burnt successfully");
          } else toast.error("NFT burn reverted");
        }
      } catch (error) {
        toast.error("There was an error burning the NFT");
      } finally {
        setHash(undefined);
        setPending(false);
      }
    },
    [writeERC721Contract]
  );

  if (isLoading) return <div>Loading NFTs...</div>;
  if (isError) return <div>Error fetching NFTs</div>;

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold mb-4">NFTs List</h1>
      </div>
      <Separator className="my-5" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
        {userNfts && userNfts.length > 0 ? (
          userNfts.map((tokenId) => (
            <Card
              key={tokenId}
              className="flex flex-col overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-purple-500 to-pink-500 dark:from-purple-700 dark:to-pink-700"
            >
              <FadeInScaleAnimation duration="1.2">
                <CardHeader className="relative text-white p-6">
                  <CardTitle className="text-3xl font-extrabold">
                    NFT #{tokenId}
                  </CardTitle>
                  <div className="absolute top-2 right-2 w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center transform rotate-12 shadow-inner">
                    <span className="text-4xl">🚀</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow p-6 text-white">
                  <div className="bg-white/10 dark:bg-gray-800/30 rounded-lg p-4 mb-4 backdrop-blur-sm">
                    <p className="text-xl font-semibold">Token ID: {tokenId}</p>
                    <p className="text-sm opacity-80">
                      Unique digital masterpiece
                    </p>
                  </div>
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="opacity-80">Minted on Polygon Amoy</span>
                    <span className="opacity-80">Rarity: Legendary</span>
                  </div>
                </CardContent>
                <CardFooter className="bg-white/10 dark:bg-gray-800/30 border-t border-white/20 dark:border-gray-700/50 p-4 flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => handleBurn(+tokenId)}
                  >
                    Burn NFT
                  </Button>
                </CardFooter>
              </FadeInScaleAnimation>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <FadeInScaleAnimation duration="0.75">
              <div className="space-y-4">
                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 dark:from-purple-300 dark:to-pink-500">
                  Your NFT collection is empty!
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Complete 2 tasks to unlock the ability to mint your first NFT.
                </p>
                <div className="flex items-center justify-center">
                  <span className="animate-bounce text-3xl mr-2">🎨</span>
                  <p className="text-gray-500 dark:text-gray-400 italic">
                    Get started on your tasks to begin your NFT journey!
                  </p>
                </div>
              </div>
            </FadeInScaleAnimation>
          </div>
        )}
        <PendingTransactionModal isOpen={pending} transactionHash={hash} />
      </div>
    </>
  );
};
