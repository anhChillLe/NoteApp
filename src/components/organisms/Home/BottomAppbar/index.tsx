import { FC } from 'react'
import { StyleSheet, ViewProps } from 'react-native'
import { IconButton } from 'react-native-paper'
import Animated, { AnimatedProps } from 'react-native-reanimated'
import { Fill } from '~/components/atoms'

interface Props extends AnimatedProps<ViewProps> {
  onNewTaskPress?: () => void
  onNewRecordPress?: () => void
  onNewImagePress?: () => void
  onNewNotePress?: () => void
  onNewPaintPress?: () => void
}

export const HomeBottomAppbar: FC<Props> = ({
  onNewImagePress,
  onNewNotePress,
  onNewPaintPress,
  onNewRecordPress,
  onNewTaskPress,
  style,
  ...props
}) => {
  return (
    <Animated.View style={[styles.container, style]} {...props}>
      <IconButton
        icon="checkbox"
        disabled={!onNewTaskPress}
        onPress={onNewTaskPress}
      />
      <IconButton
        icon="microphone"
        disabled={!onNewRecordPress}
        onPress={onNewRecordPress}
      />
      <IconButton
        icon="picture"
        disabled={!onNewImagePress}
        onPress={onNewImagePress}
      />
      <IconButton
        icon="paint-brush"
        disabled={!onNewPaintPress}
        onPress={onNewPaintPress}
      />
      <Fill />
      <IconButton
        icon="plus-small"
        mode="contained"
        size={48}
        disabled={!onNewNotePress}
        onPress={onNewNotePress}
      />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
})
