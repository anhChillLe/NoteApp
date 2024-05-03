import { FC, useCallback, useState } from 'react'
import {
  LayoutChangeEvent,
  LayoutRectangle,
  Modal,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'
import Animated, {
  LinearTransition,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
} from 'react-native-reanimated'
import { TagItem } from '~/components/molecules'
import { useHome } from '../../Provider'

interface Props extends React.ComponentProps<typeof TagItem> {}

export const DragItem: FC<Props> = props => {
  const [layout, setLayout] = useState<LayoutRectangle>()
  const { gesturePayload: payload } = useHome()

  const itemStyle = useAnimatedStyle<ViewStyle>(() => {
    if (!payload.value) return {}
    const { height = 0, width = 0 } = layout || {}
    return {
      top: -height,
      left: -width,
      transform: [
        { translateX: payload.value.absoluteX },
        { translateY: payload.value.absoluteY },
      ],
    }
  })

  const [visible, setVisible] = useState(false)

  useAnimatedReaction(
    () => payload.value,
    value => {
      runOnJS(setVisible)(!!value)
    },
  )

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => {
      setLayout(e.nativeEvent.layout)
    },
    [setLayout],
  )

  return (
    <Modal visible={visible} transparent>
      <View style={styles.container}>
        <Animated.View
          style={[styles.item_wrapper, itemStyle]}
          layout={LinearTransition}
          onLayout={handleLayout}
        >
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
