import { FC } from 'react'
import { StyleSheet, ViewProps } from 'react-native'
import Animated, { AnimatedProps } from 'react-native-reanimated'
import { StackedIconButton } from '~/components/atoms'
import { useHomeSelect } from '~/store/home'
import { useHome } from '../Provider'

interface Props extends AnimatedProps<ViewProps> {}

export const HomeActionBar: FC<Props> = ({ style, ...props }) => {
  const disable = useHomeSelect(state => state.disable)
  const pinNotes = useHome(state => state.pinNotes)
  const deleteNotes = useHome(state => state.deleteNotes)
  const hideNotes = useHome(state => state.hideNotes)

  const handlePin = () => {
    pinNotes()
    disable()
  }

  const handleHide = () => {
    hideNotes()
    disable()
  }

  const handleDelete = () => {
    deleteNotes()
    disable()
  }

  return (
    <Animated.View style={[styles.container, style]} {...props}>
      <StackedIconButton icon="thumbtack" label="Pin" onPress={handlePin} />
      <StackedIconButton icon="trash" label="Delete" onPress={handleDelete} />
      <StackedIconButton icon="eye" label="Hide" onPress={handleHide} />
      <StackedIconButton icon="share" label="Share" disabled />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
})
