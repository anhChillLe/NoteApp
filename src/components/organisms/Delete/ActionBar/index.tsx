import { FC } from 'react'
import { StyleSheet, ViewProps } from 'react-native'
import { useTheme } from 'react-native-paper'
import Animated, { AnimatedProps } from 'react-native-reanimated'
import { StackedIconButton } from '~/components/atoms'
import { useDeletedNote } from '..'

interface Props extends AnimatedProps<ViewProps> {}

export const DeletedActionBar: FC<Props> = ({ style, ...props }) => {
  const { colors } = useTheme()

  const deleteItems = useDeletedNote(state => state.deleteItems)
  const restoreItems = useDeletedNote(state => state.restoreItems)

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
        onPress={restoreItems}
        style={styles.button}
        color={colors.onSurfaceVariant}
      />
      <StackedIconButton
        label="Delete"
        icon="trash"
        onPress={deleteItems}
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
    alignItems: 'center',
  },
  button: {
    margin: 6,
  },
})
