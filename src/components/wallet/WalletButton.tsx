import { Icon } from '@iconify/react'
import { useState, useEffect } from 'react'
import { useMedia } from 'react-use'
import { Connector } from 'wagmi'

import { SUPPORTED_WALLETS } from '../../constants'

export const WalletButton = ({
  index,
  connector,
  onClick,
}: {
  index: number
  connector: Connector
  onClick: () => void
}) => {
  const [ready, setReady] = useState(false)
  const isMobile = useMedia('(max-width: 767px)')

  useEffect(() => {
    ;(async () => {
      const provider = await connector.getProvider()
      setReady(!!provider)
    })()
  }, [connector])

  if (isMobile) {
    // walletconnect is special
    if (connector.name === 'WalletConnect' && connector.type === 'walletConnect') {
      return (
        <Item
          id={`connect-${index}`}
          onClick={onClick}
          name={connector.name}
          icon={SUPPORTED_WALLETS.WALLET_CONNECT.iconName}
          isActive={ready}
        />
      )
    }
    // others don't show in mobile
    return null
  } else {
    // don't show injected wallet
    if (connector.name === 'Injected' && connector.type === 'injected') {
      return null
    }
    // metamask is special
    if (connector.name === 'MetaMask' && connector.type === 'metaMask') {
      return (
        <Item
          id={`connect-${index}`}
          onClick={onClick}
          name={connector.name}
          icon={SUPPORTED_WALLETS.METAMASK.iconName}
          isActive={ready}
        />
      )
    }
    // walletconnect is special
    if (connector.name === 'WalletConnect' && connector.type === 'walletConnect') {
      return (
        <Item
          id={`connect-${index}`}
          onClick={onClick}
          name={connector.name}
          icon={SUPPORTED_WALLETS.WALLET_CONNECT.iconName}
          isActive={ready}
        />
      )
    }
    // coinbase is special
    if (connector.name === 'Coinbase Wallet' && connector.type === 'coinbaseWallet') {
      return (
        <Item
          id={`connect-${index}`}
          onClick={onClick}
          name={index === 4 ? 'Coinbase Smart Wallet' : connector.name}
          icon={SUPPORTED_WALLETS.COINBASE.iconName}
          isActive={ready}
        />
      )
    }
    return (
      <Item
        id={`connect-${index}`}
        onClick={onClick}
        name={connector.name}
        icon={connector?.icon ?? SUPPORTED_WALLETS.METAMASK.iconName}
        isActive={ready}
      />
    )
  }
}

interface ItemProps {
  id: string
  icon: string
  name: string
  onClick?: () => void
  isActive?: boolean
}

export const Item = ({ id, onClick, name, icon }: ItemProps) => {
  return (
    <div
      id={id}
      className="py-3 px-4 flex-1 justify-between items-center rounded-lg pointer bg-[#212c42]"
    >
      <button onClick={onClick}>
        <div className="flex items-center gap-4 w-full">
          {/* <Image src={icon} alt={name + ' logo'} className="w-7 h-7" /> */}
          <Icon icon={icon} width="24" height="24" />
          <div className="flex-1 text-left text-base text-white font-semibold">{name}</div>
        </div>
      </button>
    </div>
  )
}
