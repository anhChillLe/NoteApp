import { FC } from 'react'
import { StyleSheet, ViewProps } from 'react-native'
import { IconButton, Text, useTheme } from 'react-native-paper'
import Animated, { AnimatedProps } from 'react-native-reanimated'

interface Props extends AnimatedProps<ViewProps> {
  onClosePress: () => void
  onCheckAllPress: () => void
  numOfItem: number
}

export const SelectionAppbar: FC<Props> = ({
  onCheckAllPress,
  onClosePress,
  numOfItem,
  style,
  ...props
}) => {
  const { colors } = useTheme()

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: colors.surfaceVariant },
        style,
      ]}
      {...props}
    >
      <Animated.View style={styles.sub_container}>
        <IconButton
          icon="cross-small"
          onPress={onClosePress}
          iconColor={colors.onSurfaceVariant}
        />
        <Text
          style={[styles.label, { color: colors.onSurfaceVariant }]}
          variant="titleMedium"
        >
          {numOfItem} selecteds
        </Text>
        <IconButton
          icon="list-check"
          onPress={onCheckAllPress}
          iconColor={colors.onSurfaceVariant}
        />
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    paddingHorizontal: 8,
  },
  sub_container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    flex: 1,
  },
})