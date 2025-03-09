import { KLineChart } from "./kline"
import { GridOrder } from "./order"

export const Grid = () => {
  return (
  <main className="max-w-screen-2xl w-full flex flex-col md:flex-row gap-4">
    <KLineChart base='eth' quote='usdt' interval="15m" />
    <GridOrder />
  </main>
  )
}
