import { Connector } from 'wagmi'

export interface WalletInfo {
  connector?: Connector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

type GridExInfo = {
  usdc?: `0x${string}`
  weth: `0x${string}`
  vault: `0x${string}`
  linear: `0x${string}`
  gridEx: `0x${string}`
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  // INJECTED: {
  //   connector: metaMask,
  //   name: 'Injected',
  //   iconName: RightArrow,
  //   description: 'Injected web3 provider.',
  //   href: null,
  //   color: '#010101',
  //   primary: true,
  // },
  METAMASK: {
    name: 'MetaMask',
    iconName: 'token-branded:metamask',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D',
    mobile: true,
  },
  WALLET_CONNECT: {
    name: 'WalletConnect',
    iconName: 'simple-icons:walletconnect',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true,
  },
  COINBASE: {
    name: 'Coinbase Wallet',
    iconName: 'token-branded:coinbase',
    description: 'Connect using Coinbase Wallet.',
    href: null,
    color: '#4196FC',
    mobile: true,
  },
  // COINBASESMART: {
  //   connector: coinbaseSmartWallet,
  //   name: 'Coinbase Smart Wallet',
  //   iconName: Coinbase,
  //   description: 'Connect using Coinbase Smart Wallet.',
  //   href: null,
  //   color: '#4196FC',
  //   mobile: true,
  // },
  LEDGER: {
    name: 'Ledger Wallet',
    iconName: 'token-branded:ledger',
    description: 'Connect using Ledger Wallet.',
    href: null,
    color: '#4196FC',
    mobile: true,
  },
}

export const GRID_ADDRESS: { [key: string]: GridExInfo } = {
  BASE: {
    usdc: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    weth: '0x0',
    vault: '0x0',
    linear: '0x0',
    gridEx: '0x0',
  },
  'BASE-SEPOLIA': {
    usdc: '0xe8D9fF1263C9d4457CA3489CB1D30040f00CA1b2',
    weth: '0xb15BDeAAb6DA2717F183C4eC02779D394e998e91',
    vault: '0x37E4B20992f686425E28941677eDeF00CEcC3f98',
    linear: '0xCDDa10639a0236504fb204BA1a223963D9727035',
    gridEx: '0x80585d3e318e8905e6616fd310b08ebacfc09365',
  },
}

export const getContractAddress = (
  chain: string | number,
  name: string
): `0x${string}` => {
  if (
    name !== 'gridEx' &&
    name !== 'linear' &&
    name !== 'weth' &&
    name !== 'vault' &&
    name !== 'usdc'
  ) {
    throw new Error('invalid contract name: ' + name)
  }

  if (chain === 'BASE' || +chain === 8453) {
    return GRID_ADDRESS['BASE'][name] as `0x${string}`
  } else if (chain === 'BASE-SEPOLIA' || +chain === 84532) {
    return GRID_ADDRESS['BASE-SEPOLIA'][name] as `0x${string}`
  }

  throw new Error('unsupport chain: ' + chain)
}

export const getToken = (
  chain: string | number,
  name: string) => {

  if (name === 'eth' || name === 'weth' || name === 'usdc') {

  }
  // todo
  return {
    address: ''
  }
}