import { FC } from 'react'
import { StyleSheet, ViewProps } from 'react-native'
import Animated, { AnimatedProps } from 'react-native-reanimated'
import { StackedIconButton } from '~/components/atoms'
import { useHome } from '../Provider'

interface Props extends AnimatedProps<ViewProps> {}

export const HomeActionBar: FC<Props> = ({ style, ...props }) => {
  const pinNotes = useHome(state => state.pinNotes)
  const deleteNotes = useHome(state => state.deleteNotes)
  const privateNotes = useHome(state => state.privateNotes)

  return (
    <Animated.View style={[styles.container, style]} {...props}>
      <StackedIconButton icon="thumbtack" label="Pin" onPress={pinNotes} />
      <StackedIconButton icon="trash" label="Delete" onPress={deleteNotes} />
      <StackedIconButton icon="lock" label="Private" onPress={privateNotes} />
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
