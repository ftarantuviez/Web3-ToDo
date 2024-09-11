import React, { useCallback } from "react";
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

export const NftList: React.FC = () => {
  const { writeERC721Contract } = useWriteERC721Contract();
  const {
    data: userNfts,
    isLoading,
    isError,
  } = useUserNfts(getContractAddress(ChainId.POLYGON_AMOY).nft);

  const handleBurn = useCallback(
    async (tokenId: number) => {
      try {
        const hash = await writeERC721Contract({
          address: getContractAddress(ChainId.POLYGON_AMOY).nft,
          methodName: "burn",
          args: { tokenId },
        });

        if (hash) {
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
            <Card key={tokenId} className="flex flex-col">
              <FadeInScaleAnimation duration="1.2">
                <CardHeader>
                  <CardTitle>NFT #{tokenId}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <img
                    src={`https://picsum.photos/seed/${tokenId}/200/200`}
                    alt={`NFT #${tokenId}`}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <p>Token ID: {tokenId}</p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="destructive"
                    className="w-full"
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
            <p className="text-gray-500 text-lg">No NFTs found.</p>
          </div>
        )}
      </div>
    </>
  );
};
