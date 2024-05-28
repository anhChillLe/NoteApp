import { FC } from 'react'
import { StyleSheet } from 'react-native'
import { View, Animated } from 'react-native'
import {
  Icon,
  Text,
  TouchableRipple,
  TouchableRippleProps,
  useTheme,
} from 'react-native-paper'

interface MenuSelectItemProps extends Omit<TouchableRippleProps, 'children'> {
  title: string
  isSelected?: boolean
}

const MenuSelectItem: FC<MenuSelectItemProps> = ({
  isSelected,
  title,
  ...props
}) => {
  const { colors } = useTheme()

  const backgroundColor = isSelected
    ? colors.secondaryContainer
    : colors.background

  const contentColor = isSelected
    ? colors.onSecondaryContainer
    : colors.onBackground

  return (
    <TouchableRipple {...props}>
      <View style={[styles.container, { backgroundColor }]}>
        <Text variant="bodyMedium" style={{ color: contentColor }}>
          {title}
        </Text>
        <Animated.View style={{ opacity: isSelected ? 1 : 0 }}>
          <Icon source="check" size={20} color={contentColor} />
        </Animated.View>
      </View>
    </TouchableRipple>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    gap: 32,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})

export default MenuSelectItem
