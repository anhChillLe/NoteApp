import { FC } from 'react'
import { StyleSheet, ViewProps } from 'react-native'
import Animated, {
  AnimatedProps,
  SequencedTransition,
  SlideInDown,
  SlideInRight,
  SlideOutDown,
  SlideOutRight,
} from 'react-native-reanimated'
import { StackedIconButton } from '~/components/atoms'

interface Props extends AnimatedProps<ViewProps> {
  onPinPress: () => void
  onDeletePress: () => void
  onEditPress: () => void
  showEdit?: boolean
}

export const TagManagerBottomMenuBar: FC<Props> = ({
  onDeletePress,
  onEditPress,
  onPinPress,
  showEdit,
  style,
  ...props
}) => {
  return (
    <Animated.View
      entering={SlideInDown}
      exiting={SlideOutDown}
      style={[styles.container, style]}
      {...props}
    >
      <StackedIconButton
        icon="thumbtack"
        label="Pin"
        layout={SequencedTransition}
        onPress={onPinPress}
      />
      <StackedIconButton
        icon="trash"
        label="Delete"
        layout={SequencedTransition}
        onPress={onDeletePress}
      />
      {showEdit && (
        <StackedIconButton
          icon="edit"
          label="Edit"
          layout={SequencedTransition}
          entering={SlideInRight}
          exiting={SlideOutRight}
          onPress={onEditPress}
        />
      )}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
})
