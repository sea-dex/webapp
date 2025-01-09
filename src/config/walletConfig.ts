import type { Transport } from 'viem';
import { http, type CreateConfigParameters } from 'wagmi';
import { createConfig } from 'wagmi';

import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  coinbaseWallet,
  metaMaskWallet,
  rainbowWallet,
  safeWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit';

const getWalletConfig = () => {

}

export const computeWalletConnectMetaData = ({
    appName,
    appDescription,
    appUrl,
    appIcon,
  }: ComputeMetaDataParameters): RainbowKitWalletConnectParameters['metadata'] => {
    return {
      name: appName,
      description: appDescription ?? appName,
      url: appUrl ?? (typeof window !== 'undefined' ? window.location.href : ''),
      icons: [...(appIcon ? [appIcon] : [])],
    };
  };
  
export default getWalletConfig