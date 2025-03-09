'use client'
import * as React from 'react'
import { createContext } from '@radix-ui/react-context'
// import { usePathname, useSearchParams } from 'next/navigation'

const [MenuProvider, useMenuContext] = createContext<{
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}>('MobileMenu')

export const MobileMenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false)

  /*
  const pathname = usePathname()
  const searchParams = useSearchParams()

  React.useEffect(() => {
    const handleRouteChangeComplete = () => {
      // Dismiss mobile keyboard if focusing an input (e.g. when searching)
      if (document.activeElement instanceof HTMLInputElement) {
        document.activeElement.blur()
      }

      setOpen(false)
    }

    handleRouteChangeComplete()
    return () => handleRouteChangeComplete()
    // router.events.on('routeChangeComplete', handleRouteChangeComplete)

    // return () => {
    //   router.events.off('routeChangeComplete', handleRouteChangeComplete)
    // }
  }, [pathname, searchParams])
  */

  React.useEffect(() => {
    // Match @media (--md)
    const mediaQueryList = window.matchMedia('(min-width: 768px)')

    const handleChange = () => {
      // console.log('handle change:', mediaQueryList, 'open:', open)
      setOpen(!mediaQueryList.matches)
      // setOpen((open) => (open ? !mediaQueryList.matches : false))
    }

    handleChange()
    mediaQueryList.addEventListener('change', handleChange)
    return () => mediaQueryList.removeEventListener('change', handleChange)
  }, [])

  return (
    <MenuProvider open={open} setOpen={setOpen}>
      {children}
    </MenuProvider>
  )
}

export const useMobileMenuContext = () => useMenuContext('MobileMenu')

export const MobileMenu = ({ children }: { children: React.ReactNode }) => {
  const mobileMenu = useMobileMenuContext()

  if (!mobileMenu.open) {
    return null
  }

  return <div>{children}</div>
}
