'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChangeEvent, useState } from 'react'
import { useReadContracts, useWriteContract, useWaitForTransaction, useAccount } from 'wagmi'
import { encodeAbiParameters, parseAbiParameters, zeroAddress, erc20Abi } from 'viem'
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
import { Icon } from '@iconify/react'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import GridExABI from '@/abi/GridEx.json'
import { getContractAddress } from '@/constants'
import { calcGridParams } from '@/utils/grid'
import { Token } from '@/types/Token'
import { isNativeToken } from '@/utils/address'

const FormSchema = z.object({
  priceLower: z.string(),
  priceUpper: z.string(),
  gridOrders: z.string(),
  amount: z.string(),
  compound: z.boolean().default(false),
  oneshot: z.boolean().default(false),
  fee: z.number().default(500),
})

function isValidNumber(p: string) {
  if (p === '') return false
  if (isNaN(+p)) return false
  return true
}

function GridOrder() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      priceLower: '',
      priceUpper: '',
      gridOrders: '',
      amount: '',
      compound: false,
      oneshot: false,
      fee: 500,
    },
  })
  const chain = 'BASE-SEPOLIA'
  const base: Token = {
    address: zeroAddress, // getContractAddress(chain, 'weth'),
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  }
  const quote: Token = {
    address: getContractAddress(chain, 'usdc'),
    name: 'USDC',
    symbol: 'USDC',
    decimals: 6,
  }
  const gridEx = getContractAddress(chain, 'gridEx')
  const account = useAccount()
  const query = []
  if (!isNativeToken(base)) {
    query.push({
      address: base.address as `0x${string}`,
      abi: erc20Abi,
      functionName: 'allowance',
      args: [account.address, gridEx]
    })
  }
  if (!isNativeToken(quote)) {
    query.push({
      address: quote.address as `0x${string}`,
      abi: erc20Abi,
      functionName: 'allowance',
      args: [account.address, gridEx]
    })
  }
  const allowances = useReadContracts({
    contracts: query
  })

  const { writeContractAsync } = useWriteContract()
  const [open, setOpen] = useState(false)
  const [dialogState, setDialogState] = useState({
    title: '',
    description: '',
    hash: '',
    status: ''
  })

  const onPlaceOrder = async () => {
    const val = form.getValues()
    console.log('params:', val)

    const priceCurr = 2200
    const params = calcGridParams(
      base,
      quote,
      val['amount'],
      val['priceUpper'],
      val['priceLower'],
      priceCurr,
      +val['gridOrders']
    )
    const isNativeETH = isNativeToken(base) || isNativeToken(quote)

    console.log('params:', params)
    const linear = getContractAddress(chain, 'linear')
    const linearAbi = parseAbiParameters('uint256, int256')
    const args = [
      base.address, // base
      quote.address, // quote
      {
        askStrategy: linear,
        bidStrategy: linear,
        askData: encodeAbiParameters(linearAbi, [params.askPrice0, params.askGap]),
        bidData: encodeAbiParameters(linearAbi, [params.bidPrice0, params.bidGap]),
        baseAmount: params.baseAmount,
        askOrderCount: params.askOrderCount,
        bidOrderCount: params.bidOrderCount,
        fee: val['fee'],
        compound: val['compound'],
        oneshot: val['oneshot'],
      },
    ]

    if (!isNativeToken(base) || (!isNativeToken(quote))) {
      setOpen(true)
      console.log('allowance:', allowances)

      let idx = 0
      if (!isNativeToken(base)) {
        idx ++
        let needApprove = true
        if (allowances.status === 'success') {
          const val = BigInt(allowances.data[0].result || 0)
          if (val >= params.totalBaseAmt) {
            needApprove = false
          }
        }
        if (needApprove) {
          setDialogState({
            title: 'Approve',
            description: `Approve ${base.symbol}`,
            hash: '',
            status: 'pending'
          })
          const data = await writeContractAsync({
            address: base.address as `0x${string}`,
            abi: erc20Abi,
            functionName: 'approve',
            args: [gridEx, params.totalBaseAmt]
          })
          setDialogState({
            title: 'Approve',
            description: `Approve ${base.symbol}`,
            hash: data,
            status: 'success'
          })
        }
      }

      if (!isNativeToken(quote)) {
        let needApprove = true
        if (allowances.status === 'success') {
          const val = BigInt(allowances.data[idx].result || 0)
          if (val >= params.totalQuoteAmt) {
            needApprove = false
          }
        }
        if (needApprove) {
          setDialogState({
            title: 'Approve',
            description: `Approve ${quote.symbol}`,
            hash: '',
            status: 'pending'
          })
          const data = await writeContractAsync({
            address: quote.address as `0x${string}`,
            abi: erc20Abi,
            functionName: 'approve',
            args: [gridEx, params.totalQuoteAmt]
          })
          setDialogState({
            title: 'Approve',
            description: `Approve ${quote.symbol}`,
            hash: data,
            status: 'success'
          })
        }
      }
      // await approve()
    }

    setDialogState({
      title: 'Place Grid Order',
      description: `Place ${base.symbol}/${quote.symbol} grid order`,
      hash: '',
      status: 'pending'
    })
    const data = await writeContractAsync({
      abi: GridExABI,
      address: gridEx,
      functionName: isNativeETH ? 'placeETHGridOrders' : 'placeGridOrders',
      value: isNativeETH ? (isNativeToken(base) ? params.totalBaseAmt : params.totalQuoteAmt) : BigInt(0),
      args: args,
    })

    setDialogState({
      title: 'Place Grid Order',
      description: `Place ${base.symbol}/${quote.symbol} grid order`,
      hash: data,
      status: 'success'
    })
    setTimeout(() => setOpen(false), 1500)
    console.log('writeContract return:', data)
  }

  const onPriceLower = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
    const p = e.target.value
    form.setValue('priceLower', p)
    if (isValidNumber(p)) {
      // todo drawline
    } else {
      // todo removeLine
    }
  }

  const onPriceUpper = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
    const p = e.target.value
    form.setValue('priceUpper', p)
    if (isValidNumber(p)) {
      // todo drawline
    } else {
      // todo removeLine
    }
  }

  const onAmount = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
    const amt = e.target.value
    if (isValidNumber(amt)) {
      form.setValue('amount', amt)
    }
  }

  const onGridOrders = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
    const orders = e.target.value
    if (isValidNumber(orders)) {
      form.setValue('gridOrders', orders)
    }
  }

  return (
    <div className="w-full lg:w-[420px] text-white border border-[#212c42] rounded lg:rounded-lg p-4">
      <Dialog open={open} onOpenChange={open => setOpen(open)}>
        <DialogPortal>
          <DialogOverlay className="z-50 fixed inset-0 bg-[#040b18cc] blur-lg overlay-fade"></DialogOverlay>
          <DialogContent className="text-white top-8 rounded-lg left-1/2 -translate-x-1/2 w-[90vw] max-w-[500px] h-[475px] bg-[#304255] fixed z-50">
            <DialogTitle>{dialogState.title}</DialogTitle>
            <DialogDescription>{dialogState.description}</DialogDescription>
            <div className="h-6"></div>
            <DialogClose asChild>
              <div className="absolute top-3 right-3">
                <Icon icon="radix-icons:cross-2" width={24} height={24} />
              </div>
            </DialogClose>
          </DialogContent>
        </DialogPortal>
      </Dialog>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onPlaceOrder)} className="space-y-4">
          <FormItem>
            <FormLabel>Price Range</FormLabel>
            <div className="flex flex-row items-center justify-around">
              <FormField
                name="priceLower"
                control={form.control}
                render={({ field }) => (
                  <Input
                    placeholder="Lower"
                    {...field}
                    onChange={onPriceLower}
                    className="bg-[#1d1d1d] border-0 focus-visible:ring-transparent"
                  />
                )}
              />
              <span className="px-1">-</span>
              <FormField
                name="priceUpper"
                control={form.control}
                render={({ field }) => (
                  <Input
                    placeholder="Upper"
                    {...field}
                    onChange={onPriceUpper}
                    className="bg-[#1d1d1d] border-0 focus-visible:ring-transparent"
                  />
                )}
              />
            </div>
            <FormMessage />
          </FormItem>

          <FormField
            name="gridOrders"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grids</FormLabel>
                <Input
                  placeholder="Grids"
                  {...field}
                  className="bg-[#1d1d1d] border-0"
                  onChange={onGridOrders}
                />
                {/* <FormDescription className='text-right'>
                &nbsp;xxx
              </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="amount"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <Input
                  placeholder="Amount"
                  {...field}
                  className="bg-[#1d1d1d] border-0"
                  onChange={onAmount}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Summary
            </label>

            <div className="text-sm flex flex-row items-center justify-between px-4">
              <p className="text-white/60">Buy Orders</p>
              <p>0</p>
            </div>

            <div className="text-sm flex flex-row items-center justify-between px-4">
              <p className="text-white/60">Sell Orders</p>
              <p>0</p>
            </div>

            <div className="text-sm flex flex-row items-center justify-between px-4">
              <p className="text-white/60">Price Gap</p>
              <p>0.0</p>
            </div>

            <div className="text-sm flex flex-row items-center justify-between px-4">
              <p className="text-white/60">Total ETH</p>
              <p>0.0</p>
            </div>

            <div className="text-sm flex flex-row items-center justify-between px-4">
              <p className="text-white/60">Total USDC</p>
              <p>0.0</p>
            </div>
            <FormMessage />
          </div>

          <Button type="submit" className="w-full leading-8 bg-sky-400 hover:bg-sky-500">
            Create Grid
          </Button>
        </form>
      </Form>
    </div>
  )
}

export { GridOrder }
