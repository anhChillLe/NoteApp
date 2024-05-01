import { FC } from 'react'
import { StyleSheet, ViewProps } from 'react-native'
import { Appbar, FAB } from 'react-native-paper'
import { AnimatedProps } from 'react-native-reanimated'
import { AnimatedPaper, Fill } from '~/components/atoms'

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
    <AnimatedPaper.Appbar style={[styles.container, style]} {...props}>
      <Appbar.Action
        icon="checkbox"
        disabled={!onNewTaskPress}
        onPress={onNewTaskPress}
      />
      <Appbar.Action
        icon="microphone"
        disabled={!onNewRecordPress}
        onPress={onNewRecordPress}
      />
      <Appbar.Action
        icon="picture"
        disabled={!onNewImagePress}
        onPress={onNewImagePress}
      />
      <Appbar.Action
        icon="paint-brush"
        disabled={!onNewPaintPress}
        onPress={onNewPaintPress}
      />
      <Fill />
      <FAB
        icon="plus-small"
        mode="flat"
        disabled={!onNewNotePress}
        onPress={onNewNotePress}
      />
    </AnimatedPaper.Appbar>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
})
