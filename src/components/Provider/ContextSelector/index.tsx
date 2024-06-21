/**
 * Context selector to fix render problem of context
 * This is a typescript version of https://github.com/dai-shi/use-context-selector/issues/109#issuecomment-1825228176
 */

import React, {
  Context as ContextOrig,
  FC,
  PropsWithChildren,
  createContext as createContextOrig,
  useContext as useContextOrig,
  useEffect,
  useRef,
  useSyncExternalStore,
} from 'react'

interface Store<T> {
  value: T
  subscribe: (listener: Listener) => () => void
  notify: () => void
}

type Provider<T> = FC<PropsWithChildren<{ value: T }>>

type Context<T> = ContextOrig<Store<T>> & {
  Provider: FC<PropsWithChildren<{ value: T }>>
}

type Listener = () => void

type ContextSelector<T, U> = (value: T) => U

const createStore = <T,>(value: T): Store<T> => {
  const listeners = new Set<Listener>()
  const store: Store<T> = {
    value,
    subscribe: (listener: Listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    notify: () => listeners.forEach(listener => listener()),
  }

  return store
}

const createContext = <T,>(): Context<T> => {
  const context = createContextOrig<Store<T> | undefined>(undefined)
  const ProviderOrig = context.Provider

  const Provider: Provider<T> = ({ value, children }) => {
    const storeRef = useRef<Store<T> | undefined>()
    let store = storeRef.current

    if (!store) {
      store = createStore(value)
      storeRef.current = store
    }

    useEffect(() => {
      if (!Object.is(store!.value, value)) {
        store!.value = value
        store!.notify()
      }
    }, [value, store])

    return <ProviderOrig value={store} children={children} />
  }

  context.Provider = Provider as never

  return context as Context<T>
}

const useContextSelector = <T, U>(
  context: React.Context<Store<T>>,
  selector: ContextSelector<T, U>,
): U => {
  const store = useContextOrig(context)

  if (!store) {
    throw new Error(
      'useContextSelector must be used within a Provider with a value',
    )
  }

  return useSyncExternalStore(store.subscribe, () => selector(store.value))
}

export { createContext, useContextSelector }
export type { ContextSelector }
