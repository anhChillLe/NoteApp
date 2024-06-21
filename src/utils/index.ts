import {
  ComponentProps,
  ComponentType,
  FunctionComponent,
  MemoExoticComponent,
  NamedExoticComponent,
  memo,
} from 'react'
import { StoreApi, UseBoundStore } from 'zustand'

const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

export { debounce }

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S,
) => {
  let store = _store as WithSelectors<typeof _store>
  store.use = {}
  for (let k of Object.keys(store.getState())) {
    ;(store.use as any)[k] = () => store(s => s[k as keyof typeof s])
  }

  return store
}

export { createSelectors }

function createStateLessComponent<P extends object>(
  Component: FunctionComponent<P>,
): NamedExoticComponent<P>
function createStateLessComponent<T extends ComponentType<any>>(
  Component: T,
): MemoExoticComponent<T> {
  return memo(Component, () => true)
}

export { createStateLessComponent }
