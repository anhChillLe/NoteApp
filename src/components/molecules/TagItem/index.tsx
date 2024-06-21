import React, { forwardRef } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'
import { Icon, Text, useTheme } from 'react-native-paper'
import { AnimatedProps } from 'react-native-reanimated'
import { AnimatedTouchableScale } from '~/components/Animated'
import { Fade, TouchableScaleProps } from '~/components/atoms'

interface Props extends AnimatedProps<TouchableScaleProps> {
  label: string
  icon?: string
  selectable?: boolean
  isSelected?: boolean
  isPinned?: boolean
}

const TagItem = forwardRef<View, Props>(
  ({ label, icon, isSelected, selectable = true, isPinned, ...props }, ref) => {
    const { colors, roundness } = useTheme()

    const contentColor = isSelected
      ? colors.onPrimary
      : colors.onSecondaryContainer

    const containerStyle: ViewStyle = {
      borderRadius: roundness * 3,
      backgroundColor: colors.secondaryContainer,
    }

    return (
      <AnimatedTouchableScale ref={ref} {...props}>
        <View style={[styles.container, containerStyle]}>
          {selectable && (
            <Fade
              isActive={!!isSelected}
              color={colors.primary}
              duration={150}
            />
          )}
          {!!icon && <Icon source={icon} size={12} color={contentColor} />}
          <Text style={[styles.label, { color: contentColor }]}>{label}</Text>
          {isPinned && (
            <Icon source="thumbtack" size={12} color={contentColor} />
          )}
        </View>
      </AnimatedTouchableScale>
    )
  },
)

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
