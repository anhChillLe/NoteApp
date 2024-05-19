import { FC } from 'react'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'
import { Text, useTheme } from 'react-native-paper'
import {
  AnimatedProps,
  LinearTransition,
  useAnimatedProps,
} from 'react-native-reanimated'
import { AnimatedPaper, AnimatedTouchableScale } from '~/components/Animated'
import { TouchableScaleProps } from '~/components/atoms'
import { TaskItem } from '~/services/database/model'

type Props = AnimatedProps<
  TouchableScaleProps & {
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

  const iconProps = useAnimatedProps(() => {
    return {
      color: isSlected ? colors.primary : colors.onBackground,
    }
  })

  return (
    <AnimatedTouchableScale
      style={[itemStyles.container, style]}
      scaleValue={0.96}
      disabled={true}
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
    </AnimatedTouchableScale>
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
