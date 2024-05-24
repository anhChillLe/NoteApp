import { FC, useState } from 'react'
import { Modal, StyleSheet, View } from 'react-native'
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
} from 'react-native-reanimated'
import { TagItem } from '~/components/molecules'
import { useDragingHome } from '../../DargingTagProvider'
import { Portal } from 'react-native-paper'

interface Props extends React.ComponentProps<typeof TagItem> {}

export const DragItem: FC<Props> = props => {
  const { gesturePayload, target } = useDragingHome()

  const itemStyle = useAnimatedStyle(() => {
    const { translationX = 0, translationY = 0 } = gesturePayload.value || {}

    return {
      opacity: target.value ? 1 : 0,
      top: target.value?.pageY,
      left: target.value?.pageX,
      transform: [{ translateX: translationX }, { translateY: translationY }],
    }
  })

  return (
    <Portal>
      <View style={styles.container}>
        <Animated.View style={[styles.item_wrapper, itemStyle]}>
          <TagItem {...props} />
        </Animated.View>
      </View>
    </Portal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item_wrapper: {
    alignItems: 'flex-start',
  },
})
