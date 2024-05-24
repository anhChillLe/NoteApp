import { FC } from 'react'
import { StyleSheet, ViewProps } from 'react-native'
import { useTheme } from 'react-native-paper'
import Animated, { AnimatedProps } from 'react-native-reanimated'
import { StackedIconButton } from '~/components/atoms'
import { useHome } from '../Provider'

interface Props extends AnimatedProps<ViewProps> {}

export const HomeActionBar: FC<Props> = ({ style, ...props }) => {
  const { colors } = useTheme()
  const pinNotes = useHome(state => state.pinNotes)
  const deleteNotes = useHome(state => state.deleteNotes)
  const privateNotes = useHome(state => state.privateNotes)

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: colors.surfaceVariant },
        style,
      ]}
      {...props}
    >
      <StackedIconButton
        icon="thumbtack"
        label="Pin"
        onPress={pinNotes}
        style={styles.button}
        color={colors.onSurfaceVariant}
      />
      <StackedIconButton
        icon="trash"
        label="Delete"
        onPress={deleteNotes}
        style={styles.button}
        color={colors.onSurfaceVariant}
      />
      <StackedIconButton
        icon="lock"
        label="Private"
        onPress={privateNotes}
        style={styles.button}
        color={colors.onSurfaceVariant}
      />
      <StackedIconButton
        icon="share"
        label="Share"
        disabled
        style={styles.button}
        color={colors.onSurfaceVariant}
      />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
    margin: 6,
  },
})
