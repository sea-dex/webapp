'use client'

import { IoWalletOutline } from 'react-icons/io5'
import { Drawer as DrawerPrimitive } from 'vaul'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Icon } from '@iconify/react'

import { Button } from '../ui/button'
import {
  Drawer,
  DrawerTitle,
  DrawerTrigger,
  DrawerDescription,
  DrawerPortal,
  DrawerOverlay,
} from '../ui/drawer'
import { WalletButton } from './WalletButton'

interface ConnectButtonProps {
  showBalance: boolean
  chainStatus: string
}

const ConnectButton = ({ props }: ConnectButtonProps) => {
  const account = useAccount()
  const { connectors, connect } = useConnect()
  const { disconnect } = useDisconnect()

  const showAddress = (address: `0x${string}`) =>
    address.slice(0, 6) + '....' + address.slice(address.length - 4)

  const WalletList = () => {
    return connectors.map((connector, index) => {
      return (
        <WalletButton
          key={connector.uid}
          index={index}
          connector={connector}
          onClick={() => {
            // connect action
            connect({ connector })
            // useDrawerContext.closeModals()
          }}
        />
      )
    })
  }

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <div>
          {!account.isConnected && (
            <Button className="px-6 bg-[#212c42] hover:bg-[#35435c]">
              <IoWalletOutline className="text-2xl w-8 h-8" />
              Connect
            </Button>
          )}
          {account.isConnected && (
            <Button className="px-6 bg-[#212c42] border-transparent hover:border hover:border-[#dd0000] hover:bg-[#35435c]">
              {showAddress(account.address!)}
            </Button>
          )}
        </div>
      </DrawerTrigger>

      <DrawerPortal>
        <DrawerOverlay className="fixed inset-0 bg-[#040b18cc]" />
        <DrawerPrimitive.Content className="fixed z-50 top-0 right-0 bottom-0 h-screen w-8/12 md:w-96 flex">
          <div className="relative bg-[#131c2f] z-50 h-full w-full ">
            <div className="grow p-6 m-2 flex flex-col rounded-l-xl">
              <div className="max-w-md flex flex-col gap-6">
                {!account.isConnected && (
                  <>
                    <DrawerTitle className="text-white text-xl">Connect Wallet</DrawerTitle>
                    <DrawerDescription className="hidden"></DrawerDescription>
                    <div className="flex flex-col gap-2 text-white font-medium">
                      <WalletList />
                    </div>
                  </>
                )}
                {account.isConnected && (
                  <>
                    <div className="text-white">
                      <p>{showAddress(account.address!)}</p>
                    </div>
                    <DrawerTitle className="text-white text-xl">Wallet</DrawerTitle>
                    <DrawerDescription className="hidden"></DrawerDescription>
                    <Icon
                      icon={'radix-icons:exit'}
                      width="24"
                      height="24"
                      color="#fff"
                      onClick={() => disconnect()}
                    />
                  </>
                )}

                <DrawerPrimitive.Close asChild>
                  <button className="absolute top-4 right-4 text-white">
                    <Icon 
                      icon={'radix-icons:cross-2'}
                      width="24"
                      height="24"
                      color="#fff"></Icon>
                  </button>
                </DrawerPrimitive.Close>
              </div>
            </div>
          </div>
        </DrawerPrimitive.Content>
      </DrawerPortal>
    </Drawer>
  )
}

export { type ConnectButtonProps, ConnectButton }
