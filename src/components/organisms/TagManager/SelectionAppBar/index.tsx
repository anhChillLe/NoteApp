import { FC } from 'react'
import { StyleSheet } from 'react-native'
import { ViewProps } from 'react-native'
import { IconButton, Text, useTheme } from 'react-native-paper'
import Animated, { AnimatedProps } from 'react-native-reanimated'
import { Fill } from '~/components/atoms'

export interface SelectionAppBarProps extends AnimatedProps<ViewProps> {
  onClosePress: () => void
  onCheckAllPress: () => void
  isAllChecked?: boolean
  count?: number
}

export const SelectionAppBar: FC<SelectionAppBarProps> = ({
  style,
  onClosePress,
  onCheckAllPress,
  isAllChecked,
  count = 0,
  ...props
}) => {
  const { colors } = useTheme()
  return (
    <Animated.View
      style={[styles.container, { backgroundColor: colors.background }, style]}
      {...props}
    >
      <IconButton icon="cross-small" onPress={onClosePress} />
      <Text variant="titleMedium" style={styles.title} numberOfLines={1}>
        {count} selected
      </Text>
      <IconButton
        icon="list-check"
        onPress={onCheckAllPress}
        iconColor={isAllChecked ? colors.primary : colors.onBackground}
      />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 4,
    gap: 8,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '600',
  },
})
