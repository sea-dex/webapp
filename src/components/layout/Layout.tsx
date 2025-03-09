import { Provider } from 'jotai'

import { headers } from 'next/headers'
import { cookieToInitialState } from 'wagmi'

import { MobileMenuProvider } from './header/MobileMenu'
import Footer from './Footer'
import { Header } from './header/Header'
// import { useCallback, useEffect } from 'react'
// import atomViewport from '@/states/viewport'
// import { getDefaultConfig } from '@rainbow-me/rainbowkit'
// import { mainnet, base } from 'viem/chains'
// import { MobileHeader } from './header/MobileHeader'
import { getConfig } from '../wallet/config'
import { Web3Provider } from './Providers'

// const clientConfig = getDefaultConfig({
//   // connectors,
//   appName: 'SEADEX',
//   projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID!,
//   chains: [mainnet, base],
//   transports: {
//     [mainnet.id]: http(),
//     [base.id]: http(),
//   },
//   ssr: true, // If your dApp uses server side rendering (SSR)
// })

// const InnerAPP = ({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) => {
//   // const setViewport = useSetAtom(atomViewport)
//   // const handleWindowResize = useCallback(() => {
//   //   if (typeof window !== 'undefined') {
//   //     setViewport({
//   //       width: window.innerWidth,
//   //       height: window.innerHeight,
//   //     })
//   //   }
//   // // eslint-disable-next-line react-hooks/exhaustive-deps
//   // }, [])

//   // useEffect(() => {
//   //   handleWindowResize()
//   //   window.addEventListener('resize', handleWindowResize)
//   //   return () => window.removeEventListener('resize', handleWindowResize)
//   // }, [handleWindowResize])

//   return (
//     <MobileMenuProvider>
//       <div className="bg-[#122242]">
//         <Header />
//         {children}
//         <Footer />
//       </div>
//     </MobileMenuProvider>
//   )
// }

async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const c = getConfig()
  const initialState = cookieToInitialState(c, (await headers()).get('cookie'))

  return (
    <Web3Provider initialState={initialState}>
      <Provider>
        <MobileMenuProvider>
          <div className="bg-gradient-to-b min-h-screen from-[#122242] to-[#1c2936]">
            <Header />
            {children}
            <Footer />
          </div>
        </MobileMenuProvider>
      </Provider>
    </Web3Provider>
  )
}

export default Layout
