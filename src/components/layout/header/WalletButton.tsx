'use client'

// import { useAccount, useEnsName } from 'wagmi'
// import { ConnectButton } from '@rainbow-me/rainbowkit'
import { ConnectButton } from '../../wallet/ConnectButton'
import { useMobileMenuContext } from './MobileMenu'

const WalletButton = () => {
  const { open } = useMobileMenuContext()

  return (
    <>
      <ConnectButton showBalance={!open} chainStatus="icon" />
    </>
  )
}

export default WalletButton
