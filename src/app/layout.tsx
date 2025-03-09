import type { Metadata } from 'next'
import './globals.css'
import Layout from '@/components/layout/Layout'

export const metadata: Metadata = {
  title: 'SEADEX',
  description: 'SEADEX, DEX base on Grid Order, Make LPs more profitable',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
