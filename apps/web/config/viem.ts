import { createPublicClient, http } from "viem";
import { polygonAmoy } from "viem/chains";

export const viemClient = createPublicClient({
  chain: polygonAmoy,
  transport: http("https://polygon-amoy-bor-rpc.publicnode.com"),
});
