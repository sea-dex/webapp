import { Token } from '@/types/Token'
import { getContractAddress } from '@/constants'

export interface ITokenList {
  quoteList: Token[]
  hottest: Token[]
  tokenList: Token[]
}

export async function getTokenList(chain: string | number): Promise<ITokenList> {
  const weth = getContractAddress(chain, 'weth')
  const usdc = getContractAddress(chain, 'usdc')

  const tokenWETH = {
    address: weth,
    symbol: 'WETH',
    name: 'WETH',
    decimals: 6,
  }
  const tokenUSDC = {
    address: usdc,
    symbol: 'USDC',
    name: 'USDC',
    decimals: 6,
  }
  const tokenSEA = {
    address: '0xsea',
    symbol: 'SEA',
    name: 'SEA',
    decimals: 18,
  }
  const tokenDAI = {
    address: '0xdai',
    symbol: 'DAI',
    name: 'DAI',
    decimals: 18,
  }
  const tokenAERO = {
    address: '0xaero',
    symbol: 'AERO',
    name: 'AERO',
    decimals: 18,
  }
  const tokenAAVE = {
    address: '0xaave',
    symbol: 'AAVE',
    name: 'AAVE',
    decimals: 18,
  }

  return {
    quoteList: [tokenUSDC, tokenWETH],
    hottest: [tokenUSDC, tokenWETH, tokenAERO],
    tokenList: [tokenUSDC, tokenWETH, tokenAERO, tokenDAI, tokenSEA, tokenAAVE],
  }
}
