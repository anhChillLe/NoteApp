import { FC, LegacyRef } from 'react'
import { StyleSheet, View } from 'react-native'
import {
  TouchableRipple,
  Icon,
  Text,
  TouchableRippleProps,
} from 'react-native-paper'
import Animated from 'react-native-reanimated'

interface SectionProps extends Omit<TouchableRippleProps, 'children'> {
  title: string
  value: string
  description?: string
  valueRef?: LegacyRef<View>
}

const Section: FC<SectionProps> = ({
  title,
  value,
  description,
  valueRef,
  ...props
}) => {
  return (
    <TouchableRipple {...props}>
      <Animated.View style={styles.container}>
        <Text variant="titleMedium">{title}</Text>
        <Animated.View ref={valueRef} style={styles.value_container}>
          <Text variant="bodyMedium">{value}</Text>
          <Icon source="angle-small-right" size={24} />
        </Animated.View>
      </Animated.View>
    </TouchableRipple>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  value_container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    opacity: 0.75,
  },
})

export default Section
