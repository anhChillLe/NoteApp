import { FC } from 'react'
import { StyleSheet, View, ViewProps } from 'react-native'
import { IconButton } from 'react-native-paper'
import Animated, { AnimatedProps } from 'react-native-reanimated'
import { useHome } from '../Provider'

interface Props extends AnimatedProps<ViewProps> {}

export const HomeBottomAppbar: FC<Props> = ({ style, ...props }) => {
  const openNewNoteEditor = useHome(state => state.openNewNoteEditor)
  const openNewTaskEditor = useHome(state => state.openNewTaskEditor)

  return (
    <Animated.View style={[styles.container, style]} {...props}>
      <IconButton
        icon="checkbox"
        disabled={!openNewTaskEditor}
        onPress={openNewTaskEditor}
      />
      <IconButton icon="microphone" disabled />
      <IconButton icon="picture" disabled />
      <IconButton icon="paint-brush" disabled />
      <View style={styles.fill} />
      <IconButton
        icon="plus-small"
        mode="contained"
        size={48}
        disabled={!openNewNoteEditor}
        onPress={openNewNoteEditor}
      />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fill: {
    flex: 1,
  },
})
