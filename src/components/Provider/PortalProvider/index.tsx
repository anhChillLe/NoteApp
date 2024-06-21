// PortalProvider.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react'
import { View, StyleSheet } from 'react-native'

interface PortalContextProps {
  addPortal: (node: ReactNode) => () => void
}

interface PortalProviderProps {
  children: ReactNode
}

interface PortalItem {
  key: number
  node: ReactNode
}

const PortalContext = createContext<PortalContextProps | undefined>(undefined)

export const PortalProvider = ({ children }: PortalProviderProps) => {
  const [portals, setPortals] = useState<PortalItem[]>([])
  const [nextKey, setNextKey] = useState(0)

  const addPortal = (node: ReactNode): (() => void) => {
    const key = nextKey
    setNextKey(nextKey + 1)
    setPortals([...portals, { key, node }])

    return () => {
      setPortals(currentPortals =>
        currentPortals.filter(portal => portal.key !== key),
      )
    }
  }

  return (
    <PortalContext.Provider value={{ addPortal }}>
      <View style={styles.container}>
        {children}
        {portals.map(portal => (
          <View key={portal.key} style={StyleSheet.absoluteFill}>
            {portal.node}
          </View>
        ))}
      </View>
    </PortalContext.Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export const usePortal = (): PortalContextProps => {
  const context = useContext(PortalContext)
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider')
  }
  return context
}
