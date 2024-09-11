import { Address } from "@repo/common/src/Address";
import { ChainId } from "@repo/common/src/ChainId";

/**
 * Returns the contract addresses for the specified chain ID.
 *
 * @param chainId The chain ID.
 * @returns An object containing the contract addresses for the specified chain ID.
 */
export const getContractAddress = (
  chainId: ChainId
): Readonly<{
  nft: Address;
  erc20: Address;
}> => {
  switch (chainId) {
    case ChainId.POLYGON_AMOY:
      return {
        nft: Address.ofStringOrThrow(
          "0x8E1096fd5C8Ca1EFdC1BC2F64Ae439E0888b1A46"
        ),
        erc20: Address.ofStringOrThrow(
          "0xf02f35bF1C8D2c3a1e7255FD9AddC8F2182e0627"
        ),
      };
    // Handle cases for mainnet and other chains
    default:
      throw new Error(`Unsupported chain ID: ${chainId}`);
  }
};
