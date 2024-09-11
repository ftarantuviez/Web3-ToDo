import { Address } from "@repo/common/src/Address";
import { useCallback } from "react";
import { useWriteContract } from "wagmi";
import { ERC721_ABI } from "../transactions/abis/ERC721Abi";
import { WriteContractErrorType } from "viem";
import { toast } from "../../../packages/ui/src/components/Toaster";

type BaseTx = Readonly<{ address: Address }>;

type MintTx = Readonly<
  BaseTx &
    Readonly<{
      methodName: "mint";
    }>
>;

type BurnTx = Readonly<
  BaseTx &
    Readonly<{
      methodName: "burn";
      args: Readonly<{ tokenId: bigint }>;
    }>
>;

export type ERC721Tx = MintTx | BurnTx;

export function useWriteERC721Contract() {
  const { writeContractAsync, ...rest } = useWriteContract();

  /**
   * Executes a write operation on an ERC721 contract.
   *
   * @param tx - The transaction object containing details of the ERC721 operation.
   * @returns A Promise that resolves to the result of the contract write operation.
   * @throws Will throw an error if the contract write operation fails.
   */
  const writeERC721Contract = useCallback(
    async (tx: ERC721Tx) => {
      try {
        const hash = await writeContractAsync({
          address: tx.address,
          abi: ERC721_ABI,
          functionName: tx.methodName,
          args: mapTxToArgs(tx),
        });

        return hash;
      } catch (error) {
        const err = error as WriteContractErrorType;
        // If the user rejects the transaction, we don't want to show an error message.
        if (!err.message.includes("User rejected the request.")) {
          toast.error("Transaction failed", {
            description: err.message,
          });
        }
        return undefined;
      }
    },
    [writeContractAsync]
  );

  return { writeERC721Contract, ...rest };
}

/**
 * Maps the transaction object to an array of arguments for the contract method.
 *
 * @param tx - The transaction object, either MintTx or BurnTx.
 * @returns An array of arguments to be passed to the contract method.
 *          For 'mint', it returns an empty array.
 *          For 'burn', it returns an array with the tokenId.
 */
function mapTxToArgs(tx: MintTx | BurnTx) {
  switch (tx.methodName) {
    case "mint":
      return [];
    case "burn":
      return [tx.args.tokenId];
  }
}
