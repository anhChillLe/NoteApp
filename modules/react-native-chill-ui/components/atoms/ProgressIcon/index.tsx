import { FC } from 'react'
import { StyleSheet, ViewProps } from 'react-native'
import Animated, {
  AnimatedProps,
  SharedValue,
  useAnimatedProps,
} from 'react-native-reanimated'
import { Circle, Svg } from 'react-native-svg'
import { useLayout } from '~/hooks'
import { useTheme } from '../../../styles/ThemeProvider'
import Icon, { IconName } from '../Icon'

interface ProgressIconProps extends AnimatedProps<ViewProps> {
  progress: SharedValue<number>
  icon: IconName
  size: number
  strokeWidth: number
}
const AnimatedIcon = Animated.createAnimatedComponent(Icon)
const AnimatedCircle = Animated.createAnimatedComponent(Circle)

const ProgressIcon: FC<ProgressIconProps> = ({
  strokeWidth,
  size,
  icon,
  progress,
  ...props
}) => {
  const { colors } = useTheme()

  const [containerLayout, handleContainerLayout] = useLayout()
  const cx = (containerLayout?.width ?? 0) / 2
  const cy = (containerLayout?.height ?? 0) / 2
  const R = (containerLayout?.width ?? 0) / 2 - strokeWidth
  const length = 2 * Math.PI * R
  const iconSize = size / 2

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: length * (1 - progress.value),
    }
  })

  const iconProps = useAnimatedProps(() => {
    return {}
  })

  return (
    <Animated.View
      style={[styles.container, { width: size, height: size }]}
      onLayout={handleContainerLayout}
      {...props}
    >
      <AnimatedIcon
        size={iconSize}
        name={icon}
        color={colors.primary}
        animatedProps={iconProps}
      />
      <Svg
        style={StyleSheet.absoluteFill}
        rotation={-90} // For android
        transform={[{ rotate: '-90deg' }]} // For ios
      >
        <AnimatedCircle
          cx={cx}
          cy={cy}
          r={R}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={length}
          stroke={colors.primary}
          opacity={0.75}
          strokeLinecap="round"
          animatedProps={animatedProps}
        />
      </Svg>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
    top: 'auto',
    bottom: 'auto',
    left: 'auto',
    right: 'auto',
  },
})

export default ProgressIcon
export type { ProgressIconProps }
