import { useQuery } from "@tanstack/react-query";

import { useCallback } from "react";

import { useAccount } from "wagmi";
import { viemClient } from "../config/viem";
import { Log, parseAbiItem } from "viem";
import { Address } from "@repo/common/src/Address";

export const TransferEvent = parseAbiItem(
  "event Transfer(address from, address to, uint256 tokenId)"
);

/**
 * A custom React hook that fetches and manages NFTs owned by the current user.
 *
 * This hook utilizes the Wagmi library for Ethereum account management and Viem for
 * interacting with the blockchain. It queries transfer events for a specific NFT contract
 * to determine which NFTs are owned by the current user.
 *
 * @returns {Object} An object containing the following properties:
 *   - data: An array of token IDs representing the NFTs owned by the user.
 *   - isLoading: A boolean indicating whether the data is currently being fetched.
 *   - isError: A boolean indicating whether an error occurred during the fetch.
 *   - error: The error object if an error occurred, otherwise null.
 *   - refetch: A function to manually trigger a refetch of the data.
 *
 * The hook automatically refetches data every 10 seconds if the user's address is available.
 * It uses React Query for efficient data fetching and caching.
 *
 * @example
 * const { data: userNfts, isLoading, isError } = useUserNfts();
 * if (isLoading) return <div>Loading...</div>;
 * if (isError) return <div>Error fetching NFTs</div>;
 * return <div>{userNfts.length} NFTs owned</div>;
 */
export function useUserNfts(erc721Address: Address) {
  const { address } = useAccount();

  const getNfts = useCallback(async () => {
    if (!address || !erc721Address) return [];

    // We get the logs for the Transfer event from the ERC721 contract
    const logs = await viemClient.getLogs({
      address: erc721Address,
      event: TransferEvent,
      fromBlock: 11811663n,
    });

    const ownedTokenIds = getOwnedNFTs(logs, address);

    return ownedTokenIds;
  }, [address, erc721Address]);

  return useQuery({
    queryKey: [`userBalances-${address}`],
    queryFn: async () => {
      return await getNfts();
    },
    refetchInterval: 10000,
    enabled: !!address,
  });
}

// Define the structure for tracking the latest transfer of each tokenId
interface TokenTransfer {
  from: string;
  to: string;
  blockNumber: bigint | null;
}

// Function to get the owned NFTs
function getOwnedNFTs(logs: Log[], userAddress: string): string[] {
  // Object to store the last transfer event for each tokenId
  const tokenTransfers: Record<string, TokenTransfer> = {};

  // Sort logs by blockNumber (or could use timestamp if available)
  logs.sort((a, b) => Number(a.blockNumber) - Number(b.blockNumber));

  // Iterate through logs and process each transfer event
  logs.forEach((log) => {
    const transferEvent = log.topics;
    if (
      !transferEvent ||
      !transferEvent[1] ||
      !transferEvent[2] ||
      !transferEvent[3]
    )
      return;

    // Decode the sender (from), receiver (to), and tokenId
    const fromAddress = "0x" + transferEvent[1].slice(26); // Extract from address
    const toAddress = "0x" + transferEvent[2].slice(26); // Extract to address
    const tokenId = BigInt(transferEvent[3]).toString(); // Extract tokenId as a string

    // Store the last action for the tokenId
    tokenTransfers[tokenId] = {
      from: fromAddress.toLowerCase(),
      to: toAddress.toLowerCase(),
      blockNumber: log.blockNumber,
    };
  });

  // Determine which tokenIds are still owned by the user
  const ownedTokenIds = Object.entries(tokenTransfers)
    .filter(([_, transfer]) => transfer.to === userAddress.toLowerCase()) // Filter where 'to' is the user
    .map(([tokenId]) => tokenId); // Return only the tokenId

  return ownedTokenIds;
}
