'use client'

import * as React from 'react'
// import { BoxLink } from '@/components/ui/BoxLink'
// import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
// import { useMobileMenuContext } from './MobileMenu'
import { LogoIcon } from './Logo'
import WalletButton from './WalletButton'
// import { PrivyWalletButton } from '@/components/wallet/privy'

// export interface HeaderProps {
//   children?: React.ReactNode
//   gitHubLink?: string
//   ghost?: boolean
// }

// type ScrollState = 'at-top' | 'scrolling-up' | 'scrolling-down'

export const Header = () => {
  // const mobileMenu = useMobileMenuContext()
  // const router = useRouter();
  const pathname = usePathname()!

  // const [scrollState, setScrollState] = React.useState<ScrollState>('at-top')

  // React.useEffect(() => {
  //   let previousScrollY = window.scrollY

  //   const handleScroll = () => {
  //     const direction = previousScrollY < window.scrollY ? 'scrolling-down' : 'scrolling-up'
  //     const state = window.scrollY < 30 ? 'at-top' : direction
  //     previousScrollY = window.scrollY
  //     setScrollState(state)
  //   }

  //   if (ghost) {
  //     addEventListener('scroll', handleScroll, { passive: true })
  //   } else {
  //     removeEventListener('scroll', handleScroll)
  //   }

  //   handleScroll()
  //   return () => removeEventListener('scroll', handleScroll)
  // }, [ghost])

  const activeNav = (active: boolean) =>
    active ? 'py-1.5 text-sky-500 border-b-2 border-sky-500' : 'py-1.5 hover:text-sky-500'

  return (
    <header className="top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 bg-[#122242] lg:z-50 lg:px-4">
      <div className="mx-auto">
        <div className="md:py-1 border-b border-slate-900/10 lg:border-0 dark:border-slate-300/10 mx-4 lg:mx-4">
          <div className="relative flex items-center justify-between">
            <NextLink
              href="/"
              passHref
              className="flex-none block w-12 md:w-32 overflow-hidden text-white"
            >
              <LogoIcon className="w-8 h-8 md:w-12 md:h-12" />
            </NextLink>

            <div className="relative hidden md:flex items-center justify-center text-white font-semibold">
              <nav className="text-sm leading-6 text-white">
                <ul className="flex space-x-8">
                  <li>
                    <NextLink href="/" className={activeNav(pathname === '/')}>
                      Grid
                    </NextLink>
                  </li>

                  <li>
                    <NextLink
                      href="/strategy"
                      className={activeNav(pathname.startsWith('/strategy'))}
                    >
                      Strategy
                    </NextLink>
                  </li>

                  <li>
                    <NextLink href="/reward" className={activeNav(pathname.startsWith('/reward'))}>
                      Reward
                    </NextLink>
                  </li>

                  <li>
                    <NextLink
                      href="/portfolio"
                      className={activeNav(pathname.startsWith('/portfolio'))}
                    >
                      Portfolio
                    </NextLink>
                  </li>

                  <li>
                    <NextLink
                      href="/docs"
                      target="_blank"
                      className={activeNav(pathname.startsWith('/docs'))}
                    >
                      Docs
                    </NextLink>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="text-sm relative hidden md:flex items-center justify-center text-white md:w-40 font-semibold">
              {/* <PrivyWalletButton /> */}
              <WalletButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

// const HeaderProductLink = ({
//   active,
//   children,
//   href = '',
//   ...props
// }: React.ComponentPropsWithoutRef<'a'> & { active?: boolean }) => (
//   <NextLink href={href} passHref legacyBehavior>
//     <a data-state={active ? 'active' : 'inactive'} {...props}>
//       <span>{children}</span>
//       <span>{children}</span>
//     </a>
//   </NextLink>
// )
