import React, { FC, forwardRef, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { useTheme } from 'react-native-paper'
import {
  AnimatedProps,
  LinearTransition,
  SharedValue,
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { AnimatedPaper, AnimatedTouchableScale } from '~/components/Animated'
import { TouchableScaleProps } from '~/components/atoms'

interface Props extends AnimatedProps<TouchableScaleProps> {
  label: string
  icon?: string
  isSelected?: boolean
  isPinned?: boolean
  animationDuration?: number
}

export const TagItem = forwardRef<View, Props>(
  (
    {
      label,
      style,
      icon,
      isSelected,
      animationDuration = 100,
      isPinned,
      ...props
    },
    ref,
  ) => {
    const { colors, roundness } = useTheme()
    const progress = useSharedValue(0)

    useEffect(() => {
      progress.value = withTiming(isSelected ? 1 : 0, {
        duration: animationDuration,
      })
    }, [isSelected])

    const containerStyle = useAnimatedStyle(() => {
      return {
        borderRadius: roundness * 3,
        backgroundColor: interpolateColor(
          progress.value,
          [0, 1],
          [colors.secondaryContainer, colors.primary],
        ),
      }
    }, [colors, roundness])

    const labelStyle = useAnimatedStyle(() => {
      return {
        color: interpolateColor(
          progress.value,
          [0, 1],
          [colors.onSecondaryContainer, colors.onPrimary],
        ),
      }
    }, [colors])

    const iconProps = useAnimatedProps(() => {
      const color = interpolateColor(
        progress.value,
        [0, 1],
        [colors.onSecondaryContainer, colors.onPrimary],
      )
      return { color }
    }, [colors])

    return (
      <AnimatedTouchableScale
        ref={ref}
        style={[styles.container, containerStyle, style]}
        layout={LinearTransition}
        {...props}
      >
        {!!icon && (
          <AnimatedIcon
            progress={progress}
            source={icon}
            size={12}
            layout={LinearTransition}
          />
        )}
        <AnimatedPaper.Text
          style={[labelStyle, styles.label]}
          layout={LinearTransition}
        >
          {label}
        </AnimatedPaper.Text>
        {isPinned && (
          <AnimatedPaper.Icon
            source="thumbtack"
            size={12}
            layout={LinearTransition}
            animatedProps={iconProps}
          />
        )}
      </AnimatedTouchableScale>
    )
  },
)

type AnimatedIconType = FC<
  React.ComponentProps<typeof AnimatedPaper.Icon> & {
    progress: SharedValue<number>
  }
>
const AnimatedIcon: AnimatedIconType = ({ progress, ...props }) => {
  const { colors } = useTheme()

  const iconProps = useAnimatedProps(() => {
    const color = interpolateColor(
      progress.value,
      [0, 1],
      [colors.onSecondaryContainer, colors.onPrimary],
    )
    return { color }
  }, [colors])

  return <AnimatedPaper.Icon animatedProps={iconProps} {...props} />
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  label: {
    fontWeight: '600',
  },
})
