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

export function timeAgo(date: Date, language: 'en' | 'vi' = 'en'): string {
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  const intervals = [
    { name: { en: 'year', vi: 'năm' }, seconds: 31536000 },
    { name: { en: 'month', vi: 'tháng' }, seconds: 2592000 },
    { name: { en: 'week', vi: 'tuần' }, seconds: 604800 },
    { name: { en: 'day', vi: 'ngày' }, seconds: 86400 },
    { name: { en: 'hour', vi: 'giờ' }, seconds: 3600 },
    { name: { en: 'minute', vi: 'phút' }, seconds: 60 },
  ]

  if (seconds < 60) {
    return language === 'en' ? '1 minute' : '1 phút'
  }

  const oneYearInSeconds = 31536000
  if (seconds >= oneYearInSeconds) {
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    return language === 'en'
      ? `${month}/${day}/${year}`
      : `${day}/${month}/${year}`
  }

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds)
    if (count >= 1) {
      if (count === 1) {
        return language === 'en'
          ? `1 ${interval.name.en}`
          : `1 ${interval.name.vi}`
      } else {
        return language === 'en'
          ? `${count} ${interval.name.en}s`
          : `${count} ${interval.name.vi}`
      }
    }
  }

  return language === 'en' ? 'just now' : 'vừa xong'
}
