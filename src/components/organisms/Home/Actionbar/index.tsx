import { FC } from 'react'
import { StyleSheet, ViewProps } from 'react-native'
import Animated, { AnimatedProps } from 'react-native-reanimated'
import { StackedIconButton } from '~/components/atoms'

interface Props extends AnimatedProps<ViewProps> {
  onPinPress?: () => void
  onDeletePress?: () => void
  onHidePress?: () => void
  onAddTagPress?: () => void
  onSharePress?: () => void
}

export const HomeActionBar: FC<Props> = ({
  onPinPress,
  onDeletePress,
  onHidePress,
  onAddTagPress,
  onSharePress,
  style,
  ...props
}) => {
  return (
    <Animated.View style={[styles.container, style]} {...props}>
      <StackedIconButton icon="thumbtack" label="Pin" onPress={onPinPress} />
      <StackedIconButton icon="trash" label="Delete" onPress={onDeletePress} />
      <StackedIconButton icon="eye" label="Hide" onPress={onHidePress} />
      <StackedIconButton
        icon="hastag"
        label="Add tag"
        onPress={onAddTagPress}
      />
      <StackedIconButton icon="share" label="Share" onPress={onSharePress} />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
})
