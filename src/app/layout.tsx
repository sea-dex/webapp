import type { Metadata } from 'next'
// import localFont from "next/font/local";
import './globals.css'
import '@radix-ui/themes/styles.css'
import Layout from '@/components/layout/Layout'

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

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
