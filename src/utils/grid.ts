import BigNumber from 'bignumber.js'

import { Token } from '@/types/Token'

const PRICE_MULTIPLIER = new BigNumber(10).pow(36) // 10 ** 36

type GridParams = {
  askPrice0: bigint
  bidPrice0: bigint
  askGap: bigint
  bidGap: bigint
  baseAmount: bigint
  totalBaseAmt: bigint
  totalQuoteAmt: bigint
  askOrderCount: number
  bidOrderCount: number
}

function toBigNumber(v: string | number, coe: BigNumber) {
  return BigNumber(v).multipliedBy(coe).dp(0)
}

function calcQuoteAmount(baseAmt: BigNumber, price: BigNumber, roundUp: boolean) {
  return baseAmt
    .multipliedBy(price)
    .dividedBy(PRICE_MULTIPLIER)
    .dp(0, roundUp ? BigNumber.ROUND_UP : BigNumber.ROUND_DOWN)
}

// calculate grid parameters by price range
const calcGridParams = (
  base: Token,
  quote: Token,
  baseAmount: string | number,
  priceUpper: string | number,
  priceLower: string | number,
  priceCurr: string | number,
  orderCount: number
): GridParams => {
  if (orderCount <= 1) {
    throw new Error('invalid orderCount')
  }

  const bnBaseAmt = BigNumber(10).pow(base.decimals).multipliedBy(BigNumber(baseAmount)).dp(0)
  const coefficient = new BigNumber(10)
    .pow(quote.decimals - base.decimals)
    .multipliedBy(PRICE_MULTIPLIER)
  const bnPriceLower = toBigNumber(priceLower, coefficient)
  const bnPriceUpper = toBigNumber(priceUpper, coefficient)
  const bnPriceCurr = toBigNumber(priceCurr, coefficient)
  const bnGap = bnPriceUpper
    .minus(bnPriceLower)
    .div(orderCount - 1)
    .dp(0)

  let bnAskPrice0, bnBidPrice0
  let bidOrderCount = 0,
    askOrderCount = 0
  let found = false
  for (let i = 0; i < orderCount; i++) {
    const p = bnPriceLower.plus(bnGap.multipliedBy(i))
    if (p.comparedTo(bnPriceCurr) > 0) {
      bnAskPrice0 = p
      bnBidPrice0 = i === 0 ? BigNumber(0) : p.minus(bnGap)
      found = true
      bidOrderCount = i
      askOrderCount = orderCount - i
      break
    }
  }

  if (!found) {
    // all bid orders
    bnAskPrice0 = BigNumber(0)
    bnBidPrice0 = bnPriceUpper
    bidOrderCount = orderCount
    askOrderCount = 0
  }

  let totalQuoteAmt = BigNumber(0)
  if (bidOrderCount > 0) {
    for (let i = 0; i < bidOrderCount; i ++) {
        const price = bnBidPrice0!.minus(bnGap.multipliedBy(i))
        const amt = calcQuoteAmount(bnBaseAmt, price, false)

        totalQuoteAmt = totalQuoteAmt.plus(amt)
    }
  }

  const params = {
    baseAmount: BigInt(bnBaseAmt.toFixed(0)),
    askPrice0: BigInt(bnAskPrice0!.toFixed(0)),
    bidPrice0: BigInt(bnBidPrice0!.toFixed(0)),
    askGap: BigInt(bnGap.toFixed(0)),
    bidGap: BigInt(bnGap.negated().toFixed(0)),
    askOrderCount: askOrderCount,
    bidOrderCount: bidOrderCount,
    totalBaseAmt: BigInt(bnBaseAmt.multipliedBy(askOrderCount).toFixed(0)),
    totalQuoteAmt: BigInt(totalQuoteAmt.toFixed(0)),
  }

  return params
}

// calculate grid parameters by ask price0 and bid price0
const calcGridParamsByPrice0 = (
  base: Token,
  quote: Token,
  baseAmount: string | number,
  askPrice0: string | number,
  bidPrice0: string | number,
  askGap: string | number,
  bidGap: string | number,
  askOrderCount: number,
  bidOrderCount: number
) => {
  const bnBaseAmt = BigNumber(10).pow(base.decimals).multipliedBy(BigNumber(baseAmount)).dp(0)
  const coefficient = new BigNumber(10)
    .pow(quote.decimals - base.decimals)
    .multipliedBy(PRICE_MULTIPLIER)
  const bnAskPrice0 = toBigNumber(askPrice0, coefficient)
  const bnBidPrice0 = toBigNumber(bidPrice0, coefficient)
  const bnAskGap = toBigNumber(askGap, coefficient)
  let bnBidGap = toBigNumber(bidGap, coefficient)

  if (bnBidGap.comparedTo(0) > 0) {
    bnBidGap = bnBidGap.negated()
  }

  let totalQuoteAmt = BigNumber(0)
  if (bidOrderCount > 0) {
    for (let i = 0; i < bidOrderCount; i ++) {
        const price = bnBidPrice0!.plus(bnBidGap.multipliedBy(i))
        const amt = calcQuoteAmount(bnBaseAmt, price, false)

        totalQuoteAmt = totalQuoteAmt.plus(amt)
    }
  }

  return {
    baseAmount: BigInt(bnBaseAmt.toFixed(0)),
    askPrice0: BigInt(bnAskPrice0!.toFixed(0)),
    bidPrice0: BigInt(bnBidPrice0!.toFixed(0)),
    askGap: BigInt(bnAskGap.toFixed(0)),
    bidGap: BigInt(bnBidGap.toFixed(0)),
    askOrderCount: askOrderCount,
    bidOrderCount: bidOrderCount,
    totalBaseAmt: BigInt(bnBaseAmt.multipliedBy(askOrderCount).toFixed(0)),
    totalQuoteAmt: BigInt(totalQuoteAmt.toFixed(0)),
  }
}

export { PRICE_MULTIPLIER, calcGridParams, calcGridParamsByPrice0 }
