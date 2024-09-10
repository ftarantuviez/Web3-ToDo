import { erc20Abi, formatUnits } from "viem";
import { useAccount, useReadContracts } from "wagmi";
import { Numbers } from "@repo/common/src/Numbers";
import { Address } from "@repo/common/src/Address";
import { useMemo } from "react";

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
 *                  If undefined, the hook will not perform any contract reads.
 *
 * @returns {Token | null} A Token object containing the following properties:
 *   - balance: The raw balance of the token for the connected address as a bigint.
 *   - formatted: The formatted balance of the token as a string (currently same as raw balance).
 *   - decimals: The number of decimal places for the token.
 *   - symbol: The symbol of the token.
 *   Returns null if the address is undefined, the user is not connected, or if the data fetch fails.
 *
 * @example
 * ```tsx
 * import { useToken } from './hooks/useToken';
 * import { Address } from '@repo/common/src/Address';
 *
 * function TokenInfo() {
 *   const tokenAddress = Address.ofStringOrThrow('0x1234...'); // Replace with actual token address
 *   const tokenInfo = useToken(tokenAddress);
 *
 *   if (!tokenInfo) return <div>Loading...</div>;
 *
 *   return (
 *     <div>
 *       <p>Balance: {tokenInfo.formatted} {tokenInfo.symbol}</p>
 *       <p>Decimals: {tokenInfo.decimals}</p>
 *     </div>
 *   );
 * }
 * ```
 *
 * @remarks
 * - This hook depends on the user being connected to a wallet. If no wallet is connected,
 *   it will return null.
 * - The hook uses the `useAccount` hook from wagmi to get the connected address.
 * - It utilizes the `useReadContracts` hook from wagmi to batch multiple contract reads
 *   in a single call, improving efficiency.
 * - The returned data is memoized using `useMemo` to prevent unnecessary re-renders.
 *
 * @see {@link https://wagmi.sh/react/hooks/useAccount useAccount}
 * @see {@link https://wagmi.sh/react/hooks/useReadContracts useReadContracts}
 * @see {@link https://docs.openzeppelin.com/contracts/4.x/api/token/erc20 ERC20 Standard}
 */
export function useUserToken(address: Address | undefined): Token | null {
  const { address: connectedAddress } = useAccount();
  const { data } = useReadContracts(
    address &&
      connectedAddress && {
        allowFailure: false,
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
      }
  );

  const formattedResponse = useMemo((): Token | null => {
    if (!data) {
      return null;
    }

    // We get a `readable` balance by converting the raw balance to a string
    const formattedBalance = formatUnits(data[0], data[1]);
    return {
      balance: data[0],
      balanceFormatted: Numbers.nFormatter(formattedBalance),
      decimals: data[1],
      symbol: data[2],
    };
  }, [data]);

  return formattedResponse;
}
