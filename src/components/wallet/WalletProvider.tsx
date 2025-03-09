'use client'

import { createContext } from 'react'
// import { PrivyProvider } from '@privy-io/react-auth'
// import { base } from 'viem/chains'

const WalletContext = createContext({})

const WalletProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <WalletContext.Provider value={{}}>
      {/* <PrivyProvider
        appId="cm5nm8pjw00t9cp8m1buobjq1"
        config={{
          appearance: { showWalletLoginFirst: false },
          // Configures email, wallet, Google, Apple, and Farcaster login
          loginMethods: ['wallet'],
          defaultChain: base,
          supportedChains: [base],
          embeddedWallets: {
            createOnLogin: 'all-users', // defaults to 'off' users-without-wallets
          },
        }}
      > */}
        {children}
      {/* </PrivyProvider> */}
    </WalletContext.Provider>
  )
}

export { WalletProvider }
