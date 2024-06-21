import { FC, memo, useMemo } from 'react'
import {
  GestureResponderEvent,
  StyleSheet,
  ViewProps,
  ViewStyle,
} from 'react-native'
import { useTheme } from 'react-native-paper'
import Animated, { AnimatedProps } from 'react-native-reanimated'
import { StackedIconButton } from '~/components/atoms'

interface Action {
  icon: string
  label: string
  disable?: boolean
  onPress?: (event: GestureResponderEvent) => void
}

interface Props extends AnimatedProps<ViewProps> {
  actions: Action[]
}

const ActionBar: FC<Props> = ({ actions, style, ...props }) => {
  const { colors } = useTheme()

  const containerStyle = useMemo<ViewStyle>(() => {
    return {
      backgroundColor: colors.surfaceVariant,
    }
  }, [colors])

  return (
    <Animated.View style={[styles.container, containerStyle, style]} {...props}>
      {actions.map(({ icon, onPress, label, disable }, index) => {
        return (
          <StackedIconButton
            key={index}
            icon={icon}
            label={label}
            onPress={onPress}
            disabled={disable}
            style={styles.button}
            color={colors.onSurfaceVariant}
          />
        )
      })}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
    margin: 6,
  },
})

export default ActionBar
