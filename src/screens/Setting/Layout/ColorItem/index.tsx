import { FC } from 'react'
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native'
import { MD3Colors } from 'react-native-chill-ui'
import { ZoomIn, ZoomOut } from 'react-native-reanimated'
import { AnimatedIcon } from '~/components'

interface Props extends Omit<TouchableOpacityProps, 'children'> {
  style?: StyleProp<ViewStyle>
  isSelected: boolean
  colors: MD3Colors
}

const ColorItem: FC<Props> = ({ colors, isSelected, style, ...props }) => {
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.primary }, style]}
      {...props}
    >
      {isSelected ? (
        <AnimatedIcon
          entering={ZoomIn.duration(150)}
          exiting={ZoomOut.duration(150)}
          name="checkmark-outline"
          size={24}
          color={colors.onPrimary}
        />
      ) : (
        <View />
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 48,
    aspectRatio: 1,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default ColorItem
