import { CellContainer } from '@shopify/flash-list'
import { CellContainerProps } from '@shopify/flash-list/dist/native/cell-container/CellContainer'
import { forwardRef } from 'react'
import Animated, { LinearTransition } from 'react-native-reanimated'

const AnimatedCellContainer = Animated.createAnimatedComponent(CellContainer)

export const AnimatedCell = forwardRef<any, CellContainerProps>(
  (props, ref) => {
    return (
      <AnimatedCellContainer layout={LinearTransition} {...props} ref={ref} />
    )
  },
)
