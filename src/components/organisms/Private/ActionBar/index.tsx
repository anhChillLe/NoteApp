import { FC } from 'react'
import { StyleSheet, ViewProps } from 'react-native'
import { useTheme } from 'react-native-paper'
import Animated, { AnimatedProps } from 'react-native-reanimated'
import { StackedIconButton } from '~/components/atoms'
import { usePrivateNote } from '..'

interface Props extends AnimatedProps<ViewProps> {}

export const PrivateActionBar: FC<Props> = ({ style, ...props }) => {
  const { colors } = useTheme()

  const deleteItems = usePrivateNote(state => state.deleteItems)
  const removeFromPrivate = usePrivateNote(state => state.removeFromPrivate)

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
        label="Remove"
        icon="redo-alt"
        onPress={removeFromPrivate}
        style={styles.action_bar_button}
        color={colors.onSurfaceVariant}
      />
      <StackedIconButton
        label="Delete"
        icon="trash"
        onPress={deleteItems}
        style={styles.action_bar_button}
        color={colors.onSurfaceVariant}
      />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  action_bar_button: {
    margin: 6,
  },
})
