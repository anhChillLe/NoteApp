import { Tag } from 'note-app-database'
import { FC } from 'react'
import { StyleSheet, TouchableOpacityProps } from 'react-native'
import { Text, useTheme } from 'react-native-chill-ui'
import Animated, {
  AnimatedProps,
  LinearTransition,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated'
import {
  AnimatedIcon,
  AnimatedText,
  AnimatedTouchableOpacity,
} from '~/components'

interface Props extends AnimatedProps<Omit<TouchableOpacityProps, 'children'>> {
  data: Tag
  count?: number
  selectable?: boolean
  isSelected?: boolean
}

const TagListItem: FC<Props> = ({
  data,
  selectable,
  isSelected,
  count = 0,
  style,
  ...props
}) => {
  const { colors, roundness } = useTheme()

  return (
    <AnimatedTouchableOpacity
      style={[
        {
          borderRadius: roundness * 3,
          backgroundColor:
            selectable && isSelected
              ? colors.surfaceContainerHigh
              : colors.surfaceContainerLow,
        },
        style,
      ]}
      activeOpacity={0.5}
      {...props}
    >
      <Animated.View style={styles.container}>
        {selectable && (
          <AnimatedIcon
            name={isSelected ? 'checkbox-outline' : 'square-outline'}
            size={16}
            color={isSelected ? colors.primary : colors.onBackground}
            layout={LinearTransition}
          />
        )}

        <AnimatedText
          variant="titleMedium"
          layout={LinearTransition}
          style={styles.name}
        >
          {data.name}
        </AnimatedText>

        {data.isPinned && (
          <AnimatedIcon
            name="bookmark-outline"
            size={16}
            color={colors.primary}
            layout={LinearTransition}
            entering={ZoomIn.duration(100)}
            exiting={ZoomOut.duration(100)}
          />
        )}
        <Text children={count} />
      </Animated.View>
    </AnimatedTouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  name: {
    flex: 1,
  },
})

export default TagListItem
