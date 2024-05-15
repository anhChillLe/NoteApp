import { FC } from 'react'
import { StyleSheet, ViewProps } from 'react-native'
import { IconButton } from 'react-native-paper'
import Animated, { AnimatedProps } from 'react-native-reanimated'
import { Fill } from '~/components/atoms'
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
      <Fill />
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
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
})
