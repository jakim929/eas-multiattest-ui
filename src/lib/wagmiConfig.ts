import { createConfig, configureChains } from "wagmi";
import {
  mainnet,
  optimism,
  arbitrum,
  sepolia,
  optimismGoerli,
  baseGoerli,
} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

import { getDefaultWallets } from "@rainbow-me/rainbowkit";

const { chains, publicClient } = configureChains(
  [mainnet, optimism, arbitrum, sepolia, optimismGoerli, baseGoerli],
  [publicProvider()],
);

const { connectors } = getDefaultWallets({
  appName: "EAS Multiattest",
  projectId: "fb6cee46aa52daacbaa93ac6e73f0ed7",
  chains,
});

export { chains };

export const wagmiConfig = createConfig({
  publicClient,
  connectors,
});
