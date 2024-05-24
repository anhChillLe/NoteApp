import { FC } from 'react'
import { StyleSheet, ViewProps } from 'react-native'
import { Icon, Text, TouchableRippleProps } from 'react-native-paper'
import Animated, { AnimatedProps } from 'react-native-reanimated'
import { AnimatedPaper } from '~/components/Animated'

interface Props extends AnimatedProps<Omit<TouchableRippleProps, 'children'>> {
  leadingIcon?: string
  trailingIcon?: string
  title: string
}

export const MenuItem: FC<Props> = ({
  leadingIcon,
  trailingIcon,
  title,
  disabled,
  ...props
}) => {
  return (
    <AnimatedPaper.TouchableRipple {...props}>
      <Animated.View
        style={[styles.container, { opacity: disabled ? 0.5 : 1 }]}
      >
        <Animated.View style={styles.leading_container}>
          {leadingIcon && <Icon source={leadingIcon} size={18} />}
          <Text variant="titleSmall">{title}</Text>
        </Animated.View>
        {trailingIcon && <Icon source={trailingIcon} size={18} />}
      </Animated.View>
    </AnimatedPaper.TouchableRipple>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    gap: 12,
  },
  leading_container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
})