import { useCallback } from 'react'
import { useSharedValue, withTiming } from 'react-native-reanimated'

export function useProgress() {
  const progress = useSharedValue(0)
  const start = useCallback(
    (duration: number, onFinish?: () => void) => {
      progress.value = withTiming(1, { duration }, onFinish)
    },
    [progress],
  )
  const end = useCallback(
    (duration: number, onFinish?: () => void) => {
      progress.value = withTiming(0, { duration }, onFinish)
    },
    [progress],
  )

  return { progress, start, end }
}
