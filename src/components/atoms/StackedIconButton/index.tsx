import { FC } from 'react'
import { PressableProps, StyleSheet } from 'react-native'
import { Icon, Text } from 'react-native-paper'
import { AnimatedProps } from 'react-native-reanimated'
import { AnimatedPressable } from '../Animated'

interface Props extends AnimatedProps<PressableProps> {
  icon: string
  label: string
}

export const StackedIconButton: FC<Props> = ({
  icon,
  label,
  style,
  ...props
}) => {
  return (
    <AnimatedPressable style={[styles.container, style]} {...props}>
      <Icon source={icon} size={24} />
      <Text>{label}</Text>
    </AnimatedPressable>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    alignItems: 'center',
    padding: 8,
  },
})
