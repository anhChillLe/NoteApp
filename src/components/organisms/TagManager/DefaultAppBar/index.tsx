import { FC } from 'react'
import { StyleSheet, ViewProps } from 'react-native'
import { IconButton, Text, useTheme } from 'react-native-paper'
import Animated, { AnimatedProps } from 'react-native-reanimated'

export interface DefaultAppBarProps extends AnimatedProps<ViewProps> {
  onBackPress: () => void
  onNewTagPress: () => void
}

export const DefaultAppBar: FC<DefaultAppBarProps> = ({
  onBackPress,
  onNewTagPress,
  style,
  ...props
}) => {
  const { colors } = useTheme()
  return (
    <Animated.View
      style={[styles.container, { backgroundColor: colors.background }, style]}
      {...props}
    >
      <IconButton icon="angle-small-left" onPress={onBackPress} />
      <Text
        variant="titleMedium"
        style={styles.title}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        Tags
      </Text>
      <IconButton icon="plus-small" onPress={onNewTagPress} />
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
