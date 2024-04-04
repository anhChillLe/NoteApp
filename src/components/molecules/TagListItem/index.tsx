import { FC } from 'react'
import { Pressable, PressableProps, StyleSheet, View } from 'react-native'
import { Checkbox, Icon, IconButton, Text, useTheme } from 'react-native-paper'
import Animated, { AnimatedProps } from 'react-native-reanimated'
import { Center, Fill } from '~/components/atoms'
import { Tag } from '~/services/database/model'

type Props = Omit<AnimatedProps<PressableProps>, 'children'> & {
  data: Tag
  numOfItems?: number
  isInSelection?: boolean
  isSelected?: boolean
}

export const TagListItem: FC<Props> = ({
  data,
  style,
  numOfItems = 0,
  isInSelection,
  isSelected,
  ...props
}) => {
  const { roundness, colors } = useTheme()
  const { name, isPinned, id } = data
  return (
    <AnimatedPressable
      style={[
        {
          backgroundColor: colors.surfaceVariant,
          borderRadius: roundness * 3,
        },
        styles.container,
        style,
      ]}
      {...props}
    >
      <Center style={{ aspectRatio: 1, height: '100%' }}>
        {!!isPinned && <Icon source="thumbtack" size={16} />}
      </Center>
      <Text variant="titleMedium" style={{ fontWeight: '500' }}>
        {name}
      </Text>
      <Fill />
      <Center style={{ aspectRatio: 1, height: '100%' }}>
        {isInSelection ? (
          <Checkbox.Android status={isSelected ? 'checked' : 'unchecked'} />
        ) : (
          <Text variant="bodyMedium">{numOfItems}</Text>
        )}
      </Center>
    </AnimatedPressable>
  )
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 64,
    alignItems: 'center',
  },
})
