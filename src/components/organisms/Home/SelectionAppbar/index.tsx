import { FC } from 'react'
import { StyleSheet, ViewProps } from 'react-native'
import { IconButton, Text, useTheme } from 'react-native-paper'
import Animated, {
  AnimatedProps,
  useAnimatedStyle,
} from 'react-native-reanimated'

interface Props extends AnimatedProps<ViewProps> {
  onClosePress: () => void
  onCheckAllPress: () => void
  numOfItem: number
}

export const HomeSelectionAppbar: FC<Props> = ({
  onClosePress,
  onCheckAllPress,
  numOfItem,
  style,
  ...props
}) => {
  const { colors } = useTheme()

  const containerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: colors.surfaceVariant,
    }
  }, [])

  return (
    <Animated.View style={[styles.container, containerStyle, style]} {...props}>
      <Animated.View style={styles.sub_container}>
        <IconButton icon="cross-small" onPress={onClosePress} />
        <Text style={[styles.label]} variant="titleMedium">
          {numOfItem} selecteds
        </Text>
        <IconButton icon="list-check" onPress={onCheckAllPress} />
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
