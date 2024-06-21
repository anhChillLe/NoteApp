import { FC, LegacyRef } from 'react'
import { StyleSheet, View } from 'react-native'
import {
  TouchableRipple,
  Icon,
  Text,
  TouchableRippleProps,
  HelperText,
} from 'react-native-paper'
import Animated from 'react-native-reanimated'
import { Switch } from '~/components/atoms'

interface SectionProps extends Omit<TouchableRippleProps, 'children'> {
  title: string
  description?: string
  value?: string | boolean | null | undefined
  valueRef?: LegacyRef<View>
}

const Section: FC<SectionProps> = ({
  title,
  value,
  description,
  valueRef,
  disabled,
  ...props
}) => {
  return (
    <TouchableRipple disabled={disabled} {...props}>
      <View style={[styles.container, { opacity: disabled ? 0.5 : 1 }]}>
        <View style={styles.title_container}>
          <Text variant="titleMedium">{title}</Text>
          {!!description && (
            <HelperText type="info" padding="none" children={description} />
          )}
        </View>
        {typeof value === 'string' ? (
          <Animated.View ref={valueRef} style={styles.value_container}>
            <Text variant="bodyMedium">{value}</Text>
            <Icon source="angle-small-right" size={24} />
          </Animated.View>
        ) : typeof value === 'boolean' ? (
          <Animated.View ref={valueRef} style={styles.value_container}>
            <Switch value={value} pointerEvents="none" />
          </Animated.View>
        ) : (
          <Animated.View ref={valueRef} style={styles.value_container}>
            <Icon source="angle-small-right" size={24} />
          </Animated.View>
        )}
      </View>
    </TouchableRipple>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 8,
    alignItems: 'center',
    flexDirection: 'row',
  },
  title_container: { flex: 1 },
  value_container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    opacity: 0.75,
  },
})

export default Section
