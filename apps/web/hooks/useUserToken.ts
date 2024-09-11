import { erc20Abi, formatUnits } from "viem";
import { useAccount, useReadContracts } from "wagmi";
import { Numbers } from "@repo/common/src/Numbers";
import { Address } from "@repo/common/src/Address";
import { useCallback, useMemo } from "react";
import { readContracts } from "@wagmi/core";
import { wagmiConfig } from "../contexts/AuthProvider";
import { useQuery } from "@tanstack/react-query";

/**
 * Represents a token with its balance and metadata.
 *
 * @property balance - The raw balance of the token as a bigint.
 * @property formatted - The formatted balance of the token as a string.
 * @property decimals - The number of decimal places for the token.
 * @property symbol - The symbol of the token.
 *
 * @example
 * const myToken: Token = {
 *   balance: 1000000000000000000n,
 *   formatted: "1.0",
 *   decimals: 18,
 *   symbol: "ETH"
 * };
 */
export type Token = Readonly<{
  balance: bigint;
  balanceFormatted: string;
  decimals: number;
  symbol: string;
}>;

/**
 * A custom React hook that fetches and returns token information for a given address.
 *
 * This hook uses the wagmi library to interact with ERC20 contracts and retrieve
 * token data such as balance, decimals, and symbol. It's designed to work within
 * a React component that has access to the wagmi provider.
 *
 * @param address - The address of the ERC20 token contract. This should be a valid
 *                  Ethereum address represented as an `Address` type from the common package.
 *                  If undefined, the hook will return a default Token object with zero values.
 *
 * @returns An object containing the Token data and the query status:
 *   - data: A Token object containing the following properties:
 *     - balance: The raw balance of the token for the connected address as a bigint.
 *     - balanceFormatted: The formatted balance of the token as a string, using a number formatter.
 *     - decimals: The number of decimal places for the token.
 *     - symbol: The symbol of the token.
 *   - isLoading: A boolean indicating if the query is in progress.
 *   - isError: A boolean indicating if the query encountered an error.
 *   - error: The error object if an error occurred, otherwise undefined.
 *
 * @example
 * ```tsx
 * import { useUserToken } from './hooks/useUserToken';
 * import { Address } from '@repo/common/src/Address';
 *
 * function TokenInfo() {
 *   const tokenAddress = Address.ofStringOrThrow('0x1234...'); // Replace with actual token address
 *   const { data: tokenInfo, isLoading, isError } = useUserToken(tokenAddress);
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (isError) return <div>Error fetching token info</div>;
 *
 *   return (
 *     <div>
 *       <p>Balance: {tokenInfo.balanceFormatted} {tokenInfo.symbol}</p>
 *       <p>Decimals: {tokenInfo.decimals}</p>
 *     </div>
 *   );
 * }
 * ```
 *
 * @remarks
 * - This hook depends on the user being connected to a wallet. If no wallet is connected,
 *   it will return a default Token object with zero values.
 * - The hook uses the `useAccount` hook from wagmi to get the connected address.
 * - It utilizes the `readContracts` function from @wagmi/core to batch multiple contract reads
 *   in a single call, improving efficiency.
 * - The hook uses React Query's `useQuery` for data fetching, caching, and state management.
 * - The balance is formatted using a custom number formatter for better readability.
 *
 * @see {@link https://wagmi.sh/react/hooks/useAccount useAccount}
 * @see {@link https://wagmi.sh/core/actions/readContracts readContracts}
 * @see {@link https://tanstack.com/query/latest/docs/react/reference/useQuery useQuery}
 * @see {@link https://docs.openzeppelin.com/contracts/4.x/api/token/erc20 ERC20 Standard}
 */
export function useUserToken(address: Address | undefined) {
  const { address: connectedAddress } = useAccount();

  const getUserBalance = useCallback(async (): Promise<Token> => {
    if (!address || !connectedAddress)
      return {
        balance: 0n,
        balanceFormatted: "0",
        decimals: 0,
        symbol: "",
      };

    // We read the balance, decimals, and symbol of the token
    const data = await readContracts(wagmiConfig, {
      contracts: [
        {
          address: address,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [connectedAddress],
        },
        {
          address: address,
          abi: erc20Abi,
          functionName: "decimals",
        },
        {
          address: address,
          abi: erc20Abi,
          functionName: "symbol",
        },
      ],
    });

    if (data[0].error || data[1].error || data[2].error) {
      throw new Error("Error fetching token data");
    }

    // We get a `readable` balance by converting the raw balance to a string
    const formattedBalance = formatUnits(data[0].result, data[1].result);
    return {
      balance: data[0].result,
      balanceFormatted: Numbers.nFormatter(formattedBalance),
      decimals: data[1].result,
      symbol: data[2].result,
    };
  }, [address, connectedAddress]);

  return useQuery({
    queryKey: [`userToken-${address}`],
    queryFn: async () => {
      return await getUserBalance();
    },
    enabled: !!address && !!connectedAddress,
    refetchInterval: 5000,
  });
}
