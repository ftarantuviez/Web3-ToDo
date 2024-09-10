import React from "react";
import { useUserNfts } from "../../hooks/useUserNfts";
import { Address } from "@repo/common/src/Address";
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

export const NftList: React.FC = () => {
  const {
    data: userNfts,
    isLoading,
    isError,
  } = useUserNfts(
    Address.ofStringOrThrow("0x8E1096fd5C8Ca1EFdC1BC2F64Ae439E0888b1A46")
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
                  <Button variant="destructive" className="w-full">
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
