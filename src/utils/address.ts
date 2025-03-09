import { Token } from "@/types/Token"
import { zeroAddress } from "viem"

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, charsBefore = 4, charsAfter = 4): string {
  const parsed = address
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${parsed.substring(0, charsBefore + 2)}...${parsed.substring(42 - charsAfter)}`
}

export function isNativeToken(token: string | Token) {
  if (typeof token === 'string') {
    return token === zeroAddress
  }
  
  return token.address === zeroAddress
}