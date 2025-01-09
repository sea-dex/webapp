'use client'
import { Theme } from '@radix-ui/themes'
import { MobileMenu } from './MobileMenu'

export const MobileHeader = () => (
  <MobileMenu>
    <Theme asChild className="radix-themes-custom-fonts">
      <div>Mobile Header</div>
    </Theme>
  </MobileMenu>
)
