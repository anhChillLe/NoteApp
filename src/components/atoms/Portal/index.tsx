// Portal.tsx
import { FC, PropsWithChildren, useEffect } from 'react'
import { usePortal } from '~/components/Provider/PortalProvider'

const Portal: FC<PropsWithChildren> = ({ children }) => {
  const { addPortal } = usePortal()

  useEffect(() => {
    const removePortal = addPortal(children)

    return () => {
      removePortal()
    }
  }, [children, addPortal])

  return null
}

export default Portal
