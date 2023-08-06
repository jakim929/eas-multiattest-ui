'use client'
import { createConfig, configureChains, WagmiConfig } from 'wagmi'
import {
  mainnet,
  optimism,
  arbitrum,
  sepolia,
  optimismGoerli,
  baseGoerli,
} from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit'
import { useEffect, useState } from 'react'

const { chains, publicClient } = configureChains(
  [mainnet, optimism, arbitrum, sepolia, optimismGoerli, baseGoerli],
  [publicProvider()],
)

const { connectors } = getDefaultWallets({
  appName: 'EAS Multiattest',
  projectId: 'fb6cee46aa52daacbaa93ac6e73f0ed7',
  chains,
})

const wagmiConfig = createConfig({
  publicClient,
  connectors,
})

export const WagmiProvider = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        {mounted && children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
