import { FC } from 'react'
import { StyleSheet, View } from 'react-native'
import { Icon, Text, TouchableRippleProps, useTheme } from 'react-native-paper'
import { AnimatedProps } from 'react-native-reanimated'
import { AnimatedPaper } from '~/components/Animated'

interface Props extends AnimatedProps<Omit<TouchableRippleProps, 'children'>> {
  icon: string
  color?: string
  label: string
}

export const StackedIconButton: FC<Props> = ({
  icon,
  theme,
  color,
  label,
  style,
  ...props
}) => {
  const { colors, roundness } = useTheme()

  const contentColor = color ?? colors.onBackground

  return (
    <AnimatedPaper.TouchableRipple
      style={[
        { borderRadius: roundness * 3, opacity: props.disabled ? 0.5 : 1 },
        style,
      ]}
      borderless
      {...props}
    >
      <View style={styles.container}>
        <Icon source={icon} size={24} color={contentColor} />
        <Text variant="bodyLarge" style={{ color: contentColor }}>
          {label}
        </Text>
      </View>
    </AnimatedPaper.TouchableRipple>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    alignItems: 'center',
    padding: 8,
    aspectRatio: 1,
  },
})
