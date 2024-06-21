import { FC, useEffect, useState } from 'react'
import { Pressable, StyleSheet, SwitchProps, ViewProps } from 'react-native'
import { useTheme } from 'react-native-paper'
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

interface Props extends ViewProps {
  value: boolean
  onValueChange?: (value: boolean) => void
}

const Switch: FC<Props> = ({ value, onValueChange, ...props }) => {
  const { colors } = useTheme()

  const progress = useSharedValue(Number(value))
  useEffect(() => {
    progress.value = withTiming(Number(value), { duration: 150 })
  }, [value])

  const containerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [colors.surface, colors.primary],
      ),
      borderColor: interpolateColor(
        progress.value,
        [0, 1],
        [colors.outline, colors.primary],
      ),
    }
  }, [value, colors])

  const handleStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [colors.outline, colors.onPrimary],
      ),
      margin: interpolate(progress.value, [0, 1], [6, 2]),
      width: interpolate(progress.value, [0, 1], [16, 24]),
    }
  }, [value, colors])

  const leftStyle = useAnimatedStyle(() => {
    return {
      flex: progress.value,
    }
  }, [])

  const rightStyle = useAnimatedStyle(() => {
    return {
      flex: 1 - progress.value,
    }
  }, [])

  return (
    <Pressable onPress={() => onValueChange?.(!value)} {...props}>
      <Animated.View style={[styles.container, containerStyle]}>
        <Animated.View style={leftStyle} />
        <Animated.View style={[styles.handle, handleStyle]} />
        <Animated.View style={rightStyle} />
      </Animated.View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: 52,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
  },
  handle: {
    borderRadius: 14,
    aspectRatio: 1,
  },
})

export default Switch
