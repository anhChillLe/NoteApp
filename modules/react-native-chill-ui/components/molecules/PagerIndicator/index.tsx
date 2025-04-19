import { FC, useCallback } from 'react'
import { StyleSheet, ViewProps } from 'react-native'
import Animated, { AnimatedProps, SharedValue } from 'react-native-reanimated'
import { Item } from './Item'
import { Variant } from './Item/type'

type PagerIndicatorProps = AnimatedProps<ViewProps> & {
  count: number
  current: SharedValue<number>
  variant?: Variant
  size?: number
  space?: number
  scale?: number
}

const PagerIndicator: FC<PagerIndicatorProps> = ({
  count,
  current,
  size = 6,
  space = 6,
  variant = 'morse',
  scale = variantScale[variant],
  style,
  ...props
}) => {
  const renderIndicator = useCallback(
    (index: number) => {
      return (
        <Item
          key={index}
          position={index}
          scale={scale}
          size={size}
          progress={current}
          variant={variant}
        />
      )
    },
    [scale, size, current, variant],
  )

  const heights: Record<Variant, number> = {
    morse: size,
    beads: size * scale,
    train: size,
  }

  return (
    <Animated.View
      style={[
        styles.container,
        { gap: space, height: heights[variant] },
        style,
      ]}
      {...props}
    >
      {Array.from({ length: count }, (_, i) => i).map(renderIndicator)}
    </Animated.View>
  )
}

const variantScale: Record<Variant, number> = {
  morse: 4,
  beads: 1.5,
  train: 4,
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default PagerIndicator
export type { PagerIndicatorProps }
