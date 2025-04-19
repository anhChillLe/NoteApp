import { FC, ReactNode } from 'react'
import { StyleSheet, ViewProps } from 'react-native'
import Animated, { AnimatedProps } from 'react-native-reanimated'
import { IconButton, IconButtonProps } from '../../atoms'

interface BottomAppbarProps extends AnimatedProps<ViewProps> {
  children?: ReactNode
}

type BottomAppbarType = FC<BottomAppbarProps> & {
  Action: FC<IconButtonProps>
}

const BottomAppbar: BottomAppbarType = ({ style, children, ...props }) => {
  return (
    <Animated.View style={[styles.container, style]} {...props}>
      {children}
    </Animated.View>
  )
}

BottomAppbar.Action = IconButton

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 16,
  },
})

export default BottomAppbar
export type { BottomAppbarProps }
