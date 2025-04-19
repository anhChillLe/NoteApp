import { FC } from 'react'
import { StyleSheet, ViewProps } from 'react-native'
import { IconName, ProgressIcon, useTheme } from 'react-native-chill-ui'
import Animated, {
  AnimatedProps,
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated'
import { AnimatedText } from '~/components'

interface Props extends AnimatedProps<ViewProps> {
  icon: IconName
  title: string
  offset: SharedValue<number>
  activeRange: [number, number]
}

const Activable: FC<Props> = ({
  icon,
  title,
  offset,
  activeRange,
  style,
  ...props
}) => {
  const { colors } = useTheme()

  const progress = useDerivedValue(() => {
    return interpolate(-offset.value, activeRange, [0, 1], Extrapolation.CLAMP)
  }, [activeRange, offset])

  const containerStyle = useAnimatedStyle(() => {
    return {
      height: -offset.value,
    }
  }, [offset])

  const contentstyle = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [0, 0.25], [0, 1])
    const scale = interpolate(progress.value, [0, 1], [0.25, 1])
    return {
      opacity,
      transform: [{ scale }],
    }
  }, [])

  const iconProgress = useDerivedValue(() => {
    return interpolate(progress.value, [0.5, 1], [0, 1], Extrapolation.CLAMP)
  })

  return (
    <Animated.View style={[styles.container, containerStyle, style]} {...props}>
      <Animated.View style={[styles.content_container, contentstyle]}>
        <ProgressIcon
          progress={iconProgress}
          icon={icon}
          size={64}
          strokeWidth={3}
        />
        <AnimatedText
          variant="labelMedium"
          style={[styles.label, { color: colors.primary }]}
          children={title}
        />
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  content_container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  label: {
    fontWeight: '600',
  },
})

export default Activable
