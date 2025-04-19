import { FC, Ref } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'
import {
  Icon,
  IconName,
  Text,
  TouchableScaleProps,
  useTheme,
} from 'react-native-chill-ui'
import { AnimatedProps } from 'react-native-reanimated'
import { AnimatedTouchableScale } from '~/components'

interface Props extends AnimatedProps<TouchableScaleProps> {
  ref?: Ref<View>
  label: string
  icon?: IconName
  selectable?: boolean
  isSelected?: boolean
  isPinned?: boolean
}

const TagItem: FC<Props> = ({
  ref,
  label,
  icon,
  isSelected,
  selectable = true,
  isPinned,
  ...props
}) => {
  const { colors, roundness } = useTheme()

  const contentColor = isSelected
    ? colors.onPrimary
    : colors.onSecondaryContainer

  const containerStyle: ViewStyle = {
    borderRadius: roundness * 3,
    backgroundColor:
      selectable && isSelected ? colors.primary : colors.secondaryContainer,
  }

  return (
    <AnimatedTouchableScale ref={ref} {...props}>
      <View style={[styles.container, containerStyle]}>
        {!!icon && <Icon name={icon} size={12} color={contentColor} />}
        <Text
          style={[styles.label, { color: contentColor }]}
          children={label}
        />
        {isPinned && (
          <Icon name="bookmark-outline" size={12} color={contentColor} />
        )}
      </View>
    </AnimatedTouchableScale>
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  label: {
    fontWeight: '600',
  },
})

export default TagItem
