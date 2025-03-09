import axios from 'axios'

export interface KLineItem {
  timestamp: number // millisecond,
  open: number
  high: number
  low: number
  close: number
  volume?: number
  turnover?: number
}

//  type KLineItem

export async function getKLines(base: string, quote: string, interval: string, limit = 500) {
  try {
    const uri = `https://api.binance.com/api/v3/klines?symbol=${base.toUpperCase()}${quote.toUpperCase()}&interval=${interval}&limit=${limit}`
    const resp = await axios.get(uri)
    //   console.log(resp.data)
    return resp.data.map((item: (string | number)[]) => ({
      timestamp: +item[0],
      open: +item[1],
      high: +item[2],
      low: +item[3],
      close: +item[4],
      volume: +item[5],
    }))
  } catch (e) {
    console.log(e)
    return []
  }
}

export async function getTicker(base: string, quote: string) {
  const uri = `https://api.binance.com/api/v3/ticker/price?symbol=${base}${quote}`
  const resp = await axios.get(uri)
  return resp.data.price
}
