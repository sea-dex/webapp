import { getContractAddress } from '@/constants'
import { atom } from 'jotai'

const chain = 'BASE-SEPOLIA'
const currentPair = atom({
  base: {
    address: getContractAddress(chain, 'weth'),
    symbol: 'ETH',
    name: 'ETH',
    decimals: 6,
  },
  quote: {
    address: getContractAddress(chain, 'usdc'),
    symbol: 'USDC',
    name: 'USDC',
    decimals: 6,
  },
})

const priceCurr = atom(0)

export { priceCurr, currentPair }
