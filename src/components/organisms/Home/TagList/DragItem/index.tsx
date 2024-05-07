import { FC, useState } from 'react'
import { Modal, StyleSheet, View } from 'react-native'
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
} from 'react-native-reanimated'
import { TagItem } from '~/components/molecules'
import { useDragingHome } from '../../DargingTagProvider'

interface Props extends React.ComponentProps<typeof TagItem> {}

export const DragItem: FC<Props> = props => {
  const { gesturePayload, target } = useDragingHome()
  const [visible, setVisible] = useState(false)

  useAnimatedReaction(
    () => target.value,
    value => {
      runOnJS(setVisible)(!!value)
    },
  )

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
    <Modal visible={visible} transparent>
      <View style={styles.container}>
        <Animated.View style={[styles.item_wrapper, itemStyle]}>
          <TagItem {...props} />
        </Animated.View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  item_wrapper: {
    alignItems: 'flex-start',
  },
})
