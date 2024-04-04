import { forwardRef } from 'react'
import { Pressable, PressableProps, StyleSheet, View } from 'react-native'
import { Checkbox, Text } from 'react-native-paper'
import Animated from 'react-native-reanimated'
import { TaskItem } from '~/services/database/model'

type Props = PressableProps & {
  data: TaskItem
}

export const Item = Animated.createAnimatedComponent(
  forwardRef<View, Props>(({ data, ...props }, ref) => {
    const { label, status } = data
    const isDisable = status === 'indeterminate'

    return (
      <Pressable
        ref={ref}
        style={[itemStyles.container, { opacity: isDisable ? 0.6 : undefined }]}
        {...props}>
        <Checkbox.Android status={status} />
        <Text
          variant="labelMedium"
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            flex: 1,
            textDecorationLine: isDisable ? 'line-through' : 'none',
          }}>
          {label}
        </Text>
      </Pressable>
    )
  }),
)

const itemStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
})
