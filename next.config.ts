import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  // https://dev.to/dinhkhai0201/module-not-found-cant-resolve-pino-pretty-g6
  // https://github.com/WalletConnect/walletconnect-monorepo/issues/1908
  // reactStrictMode: true,
  // webpack: (config) => {
  //   config.resolve.fallback = { fs: false, net: false, tls: false }
  //   config.externals.push('pino-pretty', 'lokijs', 'encoding')
  //   return config
  // },
}

export default nextConfig
