import { FC } from 'react'
import { PressableProps, StyleProp, StyleSheet, ViewStyle } from 'react-native'
import { Text, useTheme } from 'react-native-paper'
import { MD3Colors } from 'react-native-paper/lib/typescript/types'
import {
  AnimatedProps,
  LinearTransition,
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { AnimatedPaper } from '~/components/atoms'
import { AnimatedPressable } from '~/components/atoms/Animated'
import { TaskItem } from '~/services/database/model'

type Props = AnimatedProps<
  PressableProps & {
    style?: StyleProp<ViewStyle>
  }
> & {
  data: TaskItem
}

export const Item: FC<Props> = ({ data, style, ...props }) => {
  const { colors } = useTheme()
  const { label, status } = data
  const isDisable = status === 'indeterminate'
  const isSlected = status === 'checked'

  const isPressed = useSharedValue(false)

  const handlePressIn = () => {
    isPressed.value = true
  }

  const handlePressOut = () => {
    isPressed.value = false
  }

  const iconProps = useAnimatedProps(() => {
    return {
      color: isSlected ? colors.primary : colors.onBackground,
    }
  })

  const containerStyle = useAnimatedStyle(() => {
    const scale = withTiming(isPressed.value ? 0.95 : 1, { duration: 100 })
    const opacity = isDisable
      ? 0.6
      : withTiming(isPressed.value ? 0.8 : 1, { duration: 100 })
    return {
      opacity,
      transform: [{ scale }],
    }
  })

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[itemStyles.container, containerStyle, style]}
      {...props}
    >
      <AnimatedPaper.Icon
        source={icons[status]}
        size={16}
        layout={LinearTransition}
        animatedProps={iconProps}
      />
      <Text
        variant="labelMedium"
        numberOfLines={1}
        ellipsizeMode="tail"
        style={{
          flex: 1,
          textDecorationLine: isDisable ? 'line-through' : 'none',
        }}
      >
        {label}
      </Text>
    </AnimatedPressable>
  )
}

const icons: Record<TaskItemStatus, string> = {
  checked: 'checkbox',
  unchecked: 'square',
  indeterminate: 'square',
}

const itemStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
})
