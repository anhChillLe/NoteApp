import {
  createContext,
  FC,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { StyleSheet, View } from 'react-native'

interface PortalContextProps {
  addPortal: (key: string, node: ReactNode) => void
  removePortal: (key: string) => void
}

interface PortalItem {
  key: string
  node: ReactNode
}

const PortalContext = createContext<PortalContextProps | undefined>(undefined)

const PortalProvider: FC<PropsWithChildren> = ({ children }) => {
  const [portals, setPortals] = useState<PortalItem[]>([])

  const addPortal = useCallback((key: string, node: ReactNode) => {
    setPortals(prev => {
      const index = prev.findIndex(portal => portal.key === key)
      if (index === -1) {
        return [...prev, { key, node }]
      } else {
        return prev.map(p => (p.key === key ? { key, node } : p))
      }
    })
  }, [])

  const removePortal = useCallback((key: string) => {
    setPortals(prev => prev.filter(p => p.key !== key))
  }, [])

  const value = useMemo(
    () => ({ addPortal, removePortal }),
    [addPortal, removePortal],
  )

  return (
    <PortalContext.Provider value={value}>
      <View style={styles.container}>
        {children}
        {portals.map(portal => (
          <View
            key={portal.key}
            style={StyleSheet.absoluteFill}
            children={portal.node}
          />
        ))}
      </View>
    </PortalContext.Provider>
  )
}

interface PortalProps extends PropsWithChildren {}
type Portal = FC<PortalProps> & {
  Host: FC<PropsWithChildren>
}

const Portal: Portal = ({ children }) => {
  const keyRef = useRef(generateSimpleKey())
  const { addPortal, removePortal } = usePortal()

  useEffect(() => {
    addPortal(keyRef.current, children)
  }, [children, addPortal])

  useEffect(() => {
    const key = keyRef.current
    return () => removePortal(key)
  }, [removePortal])

  return null
}

Portal.Host = PortalProvider

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

const usePortal = (): PortalContextProps => {
  const context = useContext(PortalContext)
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider')
  }
  return context
}

const generateSimpleKey = () => Math.random().toString(36).substring(2, 9)

export default Portal
export type { PortalProps }
