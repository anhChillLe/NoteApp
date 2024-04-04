import { FC } from 'react'
import { interpolate, useDerivedValue } from 'react-native-reanimated'
import { ItemProps } from '../type'
import { BreadsItem } from './BreadsItem'
import { MorseItem } from './MorseItem'
import { TrainItem } from './TrainItem'

export const Item: FC<ItemProps> = ({
  size,
  progress,
  position,
  variant,
  scale,
}) => {
  const extra = useDerivedValue(() => {
    return interpolate(
      progress.value - position,
      [-1, 0, 1],
      [0, 1, 0],
      'clamp',
    )
  }, [position, progress])

  switch (variant) {
    case 'morse':
      return <MorseItem extra={extra} size={size} scale={scale} />
    case 'beads':
      return <BreadsItem extra={extra} size={size} scale={scale} />
    case 'train':
      return <TrainItem extra={extra} size={size} scale={scale} />
  }
}
