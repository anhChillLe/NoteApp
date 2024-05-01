import { memo } from 'react'
import { OnboardingAppbar } from './Appbar'
import { OnboardingPage } from './Page'

export namespace Onboarding {
  export const Page = memo(OnboardingPage)
  export const Appbar = memo(OnboardingAppbar)
}
