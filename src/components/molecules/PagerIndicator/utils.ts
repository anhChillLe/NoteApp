import { SharedValue } from 'react-native-reanimated'
import { Variant } from './type'

const arr = (n: number) => [...Array(n).keys()]

const calculateExtraValue = (index: number, progress: SharedValue<number>) => {
  'worklet'
  const dis = progress.value - index
  if (dis > 1) return 0
  if (dis > 0) return 1 - dis
  if (dis < -1) return 0
  return dis + 1
}

const variantScale: Record<Variant, number> = {
  morse: 4,
  beads: 1.5,
  train: 4,
}

export { arr, calculateExtraValue, variantScale }
