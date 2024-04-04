import { DependencyList, useEffect, useState } from 'react'

function useDebounce<T>(value: T, delay: number): T
function useDebounce<T>(value: T, delay: number, deps: DependencyList): T

function useDebounce<T>(
  value: T,
  delay: number = 300,
  deps?: DependencyList,
): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(
    () => {
      const handler = setTimeout(() => setDebouncedValue(value), delay)

      return () => clearTimeout(handler)
    },
    deps ? [delay, ...deps] : [value, delay],
  )

  return debouncedValue
}

export { useDebounce }
