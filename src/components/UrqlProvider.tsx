'use client'
import { useMemo } from 'react'
import { Client, Provider, cacheExchange, fetchExchange } from 'urql'
import { useNetwork } from 'wagmi'

import {
  mainnet,
  optimism,
  arbitrum,
  sepolia,
  optimismGoerli,
  baseGoerli,
} from 'wagmi/chains'

const EAS_GRAPHQL_ENDPOINTS: Record<number, string> = {
  [mainnet.id]: '	https://easscan.org/graphql',
  [optimism.id]: 'https://optimism.easscan.org/graphql',
  [arbitrum.id]: 'https://arbitrum.easscan.org/graphql',
  [sepolia.id]: 'https://sepolia.easscan.org/graphql',
  [optimismGoerli.id]: 'https://optimism-goerli.easscan.org/graphql',
  [baseGoerli.id]: 'https://base-goerli.easscan.org/graphql',
}

export const UrqlProvider = ({ children }: { children: React.ReactNode }) => {
  const { chain } = useNetwork()
  const chainId = chain?.id || 1

  const urqlClient = useMemo(
    () =>
      new Client({
        url: EAS_GRAPHQL_ENDPOINTS[chainId],
        exchanges: [cacheExchange, fetchExchange],
      }),
    [chainId],
  )

  return <Provider value={urqlClient}>{children}</Provider>
}
