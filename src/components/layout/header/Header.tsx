'use client'
import * as React from 'react'
import { AccessibleIcon, Flex, Theme } from '@radix-ui/themes'
import styles from './Header.module.css'
import { BoxLink } from '@/components/ui/BoxLink'
import { ThemeToggle } from './ThemeToggle'
// import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { useMobileMenuContext } from './MobileMenu'
import { cn } from '@/lib/utils'
import { LogoIcon } from './Logo'
import { RemoveScroll } from 'react-remove-scroll'
import WalletButton from './WalletButton'

export interface HeaderProps {
  children?: React.ReactNode
  gitHubLink?: string
  ghost?: boolean
}

type ScrollState = 'at-top' | 'scrolling-up' | 'scrolling-down'

export const Header = ({ ghost }: HeaderProps) => {
  const mobileMenu = useMobileMenuContext()
  // const router = useRouter();
  const pathname = usePathname()!

  const [scrollState, setScrollState] = React.useState<ScrollState>('at-top')

  React.useEffect(() => {
    let previousScrollY = window.scrollY

    const handleScroll = () => {
      const direction = previousScrollY < window.scrollY ? 'scrolling-down' : 'scrolling-up'
      const state = window.scrollY < 30 ? 'at-top' : direction
      previousScrollY = window.scrollY
      setScrollState(state)
    }

    if (ghost) {
      addEventListener('scroll', handleScroll, { passive: true })
    } else {
      removeEventListener('scroll', handleScroll)
    }

    handleScroll()
    return () => removeEventListener('scroll', handleScroll)
  }, [ghost])

  return (
    <Theme asChild className="radix-themes-custom-fonts">
      <div
        data-scroll-state={scrollState}
        data-mobile-menu-open={mobileMenu.open}
        className={cn(styles.HeaderRoot, ghost ? styles.ghost : '')}
      >
        <div className={styles.HeaderInner}>
          {/* Components that hide the scrollbar (like Dialog) add padding to
					account for the scrollbar gap to avoid layout jank. This does not
					work for position: fixed elements. Since we use react-remove-scroll
					under the hood for those primitives, we can add this helper class
					provided by that lib to deal with that for the Header.
					https://github.com/radix-ui/website/issues/64
					https://github.com/theKashey/react-remove-scroll#positionfixed-elements */}
          <div
            className={RemoveScroll.classNames.fullWidth}
            style={{
              position: 'absolute',
              height: 'inherit',
              top: 0,
              left: 0,
              right: 0,
            }}
          >
            <Flex
              display={{ sm: 'none' }}
              align="center"
              position="absolute"
              top="0"
              bottom="0"
              left="0"
              pl="4"
            >
              <NextLink href="/" passHref legacyBehavior>
                <BoxLink>
                  <AccessibleIcon label="Homepage">
                    <LogoIcon />
                  </AccessibleIcon>
                </BoxLink>
              </NextLink>
            </Flex>

            <div className={styles.HeaderProductLinksContainer}>
              <HeaderProductLink href="/grid" active={pathname.startsWith('/grid')}>
                Grid
              </HeaderProductLink>
              <HeaderProductLink href="/strategy" active={pathname.startsWith('/strategy')}>
                Strategy
              </HeaderProductLink>
              <HeaderProductLink href="/airdrop" active={pathname.startsWith('/airdrop')}>
                Airdrop
              </HeaderProductLink>
              <HeaderProductLink href="/portfolio" active={pathname.startsWith('/portfolio')}>
                Portfolio
              </HeaderProductLink>
              <HeaderProductLink href="/docs" active={pathname.startsWith('/docs')}>
                Docs
              </HeaderProductLink>
            </div>

            <Flex
              display={{ initial: 'none', md: 'flex' }}
              align="center"
              gap="5"
              position="absolute"
              top="0"
              bottom="0"
              right="0"
              pr="4"
            >
              {/* <Link size="2" color="gray" href="/blog" highContrast={pathname.includes('/blog')}>
                Blog
              </Link> */}
              <WalletButton />

              <ThemeToggle />
            </Flex>

            <Flex
              display={{ md: 'none' }}
              align="center"
              gap="4"
              position="absolute"
              top="0"
              bottom="0"
              right="0"
              pr="4"
            >
              <div className={styles.HeaderThemeToggleContainer}>
                <ThemeToggle />
              </div>
              {/* 
              <Tooltip className="radix-themes-custom-fonts" content="Navigation">
                <IconButton
                  size="3"
                  variant="ghost"
                  color="gray"
                  data-state={mobileMenu.open ? 'open' : 'closed'}
                  onClick={() => mobileMenu.setOpen((open: boolean) => !open)}
                  className={styles.MobileMenuButton}
                >
                  <HamburgerMenuIcon width="16" height="16" />
                </IconButton>
              </Tooltip> */}
            </Flex>
          </div>
        </div>
      </div>
    </Theme>
  )
}

const HeaderProductLink = ({
  active,
  children,
  href = '',
  ...props
}: React.ComponentPropsWithoutRef<'a'> & { active?: boolean }) => (
  <NextLink href={href} passHref legacyBehavior>
    <a data-state={active ? 'active' : 'inactive'} className={styles.HeaderProductLink} {...props}>
      <span className={styles.HeaderProductLinkInner}>{children}</span>
      <span className={styles.HeaderProductLinkInnerHidden}>{children}</span>
    </a>
  </NextLink>
)
