import { FC } from 'react'
import { StyleSheet, ViewProps } from 'react-native'
import { IconButton } from 'react-native-paper'
import Animated, { AnimatedProps } from 'react-native-reanimated'

interface Action {
  icon: string
  onPress?: () => void
  primary?: boolean
  disable?: boolean
}

interface Props extends AnimatedProps<ViewProps> {
  actions: Action[]
}

const BottomAppbar: FC<Props> = ({ actions, style, ...props }) => {
  return (
    <Animated.View style={[styles.container, style]} {...props}>
      {actions.map((action, index) => {
        const { icon, disable, onPress, primary } = action
        const mode = primary ? 'contained' : undefined
        const size = primary ? 48 : 24
        return (
          <IconButton
            key={index}
            icon={icon}
            onPress={onPress}
            disabled={disable}
            mode={mode}
            size={size}
          />
        )
      })}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
})

export default BottomAppbar
