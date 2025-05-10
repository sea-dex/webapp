'use client'

import { useEffect, useState } from 'react'
import { init, dispose, Chart } from 'klinecharts'
import { Icon } from '@iconify/react'
import { useAtom, useSetAtom } from 'jotai'

import { getKLines } from '@/api/kline'
import { updateChartStyles } from './chart'

import { getCurrentIntervalStart } from '@/utils/kline'
import { currentPair, priceCurr } from '@/states/pair'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '@radix-ui/react-dialog'
import { cn } from '@/lib/utils'
import PairSelect from './PairSelect'
import { getTokenList, ITokenList } from '@/api/tokenList'
import { useAccount, useConnect } from 'wagmi'


interface KLineChartProps {
  base: string
  quote: string
  interval: string
}

const getKlineQueryKey = (props: KLineChartProps) => {
  return (
    props.base +
    '-' +
    props.quote +
    ':' +
    props.interval +
    ':' +
    getCurrentIntervalStart(props.interval)
  )
}

const klineIntervals = ['15m', '30m', '1h', '4h', '8h', '12h', '1d', '1w']
function KLineChart(props: KLineChartProps) {
  const {chainId} = useAccount()
  const setPriceCurr = useSetAtom(priceCurr)
  const [pair, setPair] = useAtom(currentPair)
  const [tokens, setTokens] = useState<ITokenList>({quoteList: [{
  }], hottest: [], tokenList: []})

  const updateKLineData = async (chart: Chart) => {
    let cachedKey = ''
    const updateFn = async () => {
      const key = getKlineQueryKey(props)
      if (key === cachedKey) {
        const items = await getKLines(props.base, props.quote, props.interval, 1)
        if (items.length > 0) {
          setPriceCurr(items[items.length - 1].close)
          chart.updateData(items[items.length - 1])
        }
        // console.log('update latest price')
      } else {
        const items = await getKLines(props.base, props.quote, props.interval)
        if (items.length > 0) {
          setPriceCurr(items[items.length - 1].close)
          chart.applyNewData(items)
          cachedKey = key
          console.log('update total data')
        }
      }
    }

    await updateFn()
    const tmr = setInterval(async () => {
      await updateFn()
    }, 1000)
    return tmr
  }

  useEffect(() => {
    const fn = async() => {
      const res = await getTokenList(chainId!)
      setTokens(res)
    }
    fn()
  }, [chainId])

  useEffect(() => {
    const chart = init('chart')
    updateChartStyles(chart!)
    chart!.setBarSpace(6)
    chart!.setOffsetRightDistance(8)
    let tmr: ReturnType<typeof setInterval> | null = null

    // Use immediate invoked async function inside effect
    ;(async () => {
      tmr = await updateKLineData(chart!)
    })()

    return () => {
      dispose('chart')
      if (tmr !== null) {
        clearInterval(tmr)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props])

  return (
    <div className="bg-[#111c30]">
      <div className="p-4 text-white flex flex-row items-center gap-4 justify-between h-16">
        <Dialog>
          <DialogTrigger asChild>
            <div className="flex items-center">
              <button className="pr-2">{pair.base.symbol}/{pair.quote.symbol}</button>
              <Icon icon="radix-icons:caret-down" width={24} height={24} />
            </div>
          </DialogTrigger>

          <DialogPortal>
            <DialogOverlay className='z-50 fixed inset-0 bg-[#040b18cc] blur-lg overlay-fade'></DialogOverlay>
            <DialogContent className="text-white top-8 rounded-lg left-1/2 -translate-x-1/2 w-[90vw] max-w-[500px] h-[475px] bg-[#304255] fixed z-50">
              <DialogTitle>Select Pair</DialogTitle>
              <DialogDescription>select grid pair</DialogDescription>
              <PairSelect tokens={tokens} />
              <div className="h-6">Select Token</div>
              <DialogClose asChild>
                <div className='absolute top-3 right-3'>
                <Icon icon="radix-icons:cross-2" width={24} height={24} />
                </div>
              </DialogClose>
            </DialogContent>
          </DialogPortal>
        </Dialog>

        <div className='w-[1px] h-full leading-6 block bg-white/10'></div>
        <div className='flex-1'>
          <div className='flex flex-col'>
            <div className='flex flex-row gap-1 text-sm'>
            {klineIntervals.map(period => {
                return <button key={period} className={cn(period === '15m'? 'text-white bg-[#242424]' : 'text-white/50', 'py-1 px-2 rounded-md')}>{period}</button>
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <p className="text-xs text-white/50">ETH</p>
          <p className="text-xs text-white/50">USDC</p>
        </div>
      </div>

      <div className="bg-[#ffffff14] h-[1px]"></div>

      <div
        id="chart"
        style={{ width: 840, height: 480 }}
        className="pt-3 border-transparent border border-[#212c42] rounded lg:rounded-lg z-10"
      ></div>
    </div>
  )
}

export { type KLineChartProps, KLineChart }
