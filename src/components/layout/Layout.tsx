'use client'

import { Provider, useSetAtom } from 'jotai'

import '@rainbow-me/rainbowkit/styles.css'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { WagmiProvider, http } from 'wagmi'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

// import WalletButton from "./header/WalletButton"
// import { connectorsForWallets } from '@rainbow-me/rainbowkit';
// import {
//   rainbowWallet,
//   metaMaskWallet,
//   coinbaseWallet,
//   walletConnectWallet,
// } from '@rainbow-me/rainbowkit/wallets';

import { MobileMenuProvider } from './header/MobileMenu'
import Footer from './Footer'
import { Header } from './header/Header'
import { useCallback, useEffect } from 'react'
import atomViewport from '@/states/viewport'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, base } from 'viem/chains'
import { MobileHeader } from './header/MobileHeader'

const clientConfig = getDefaultConfig({
  // connectors,
  appName: 'SEADEX',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID!,
  chains: [mainnet, base],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
  },
  ssr: true, // If your dApp uses server side rendering (SSR)
})

const queryClient = new QueryClient()

const InnerAPP = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  const setViewport = useSetAtom(atomViewport)
  const handleWindowResize = useCallback(() => {
    if (typeof window !== 'undefined') {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
  }, [])

  useEffect(() => {
    handleWindowResize()
    window.addEventListener('resize', handleWindowResize)
    return () => window.removeEventListener('resize', handleWindowResize)
  }, [handleWindowResize])

  return (
    <MobileMenuProvider>
      <div className="hidden md:flex md:flex-col md:min-h-screen">
        <Header />
        {children}
        <Footer />
      </div>

      <div className="w-full h-full overflow-y-auto pb-18 md:hidden">
        <MobileHeader />
        {children}
      </div>
    </MobileMenuProvider>
  )
}

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <Provider>
      <WagmiProvider config={clientConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <InnerAPP>
                {children}
            </InnerAPP>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </Provider>
  )
}

export default Layout
