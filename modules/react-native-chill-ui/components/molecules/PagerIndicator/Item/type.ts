import { SharedValue } from 'react-native-reanimated'

type Variant = 'morse' | 'beads' | 'train'
type Direction = 'row' | 'column'

export interface ItemProps {
  position: number
  progress: SharedValue<number>
  size: number
  variant: Variant
  scale: number
}

export type { Direction, Variant }
