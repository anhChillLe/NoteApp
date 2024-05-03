import { FC } from 'react'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { TagItem } from '~/components/molecules'
import { useHome } from '../..'

interface Props extends React.ComponentProps<typeof TagItem> {
  isDraging: boolean
  onDragStart?: () => void
  onDragEnd?: () => void
}
export const DragableTagItem: FC<Props> = ({
  isDraging,
  onDragStart,
  onDragEnd,
  style,
  ...props
}) => {
  const isPressed = useSharedValue(false)
  const { gesturePayload } = useHome()

  const gesture = Gesture.Pan()
    .activateAfterLongPress(200)
    .onBegin(e => {
      isPressed.value = true
    })
    .onStart(e => {
      gesturePayload.value = e
      onDragStart && runOnJS(onDragStart)()
    })
    .onUpdate(e => {
      gesturePayload.value = e
    })
    .onEnd(e => {
      onDragEnd && runOnJS(onDragEnd)()
    })
    .onFinalize(e => {
      isPressed.value = false
      gesturePayload.value = undefined
    })

  const itemStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isPressed.value ? 0.75 : 1),
      transform: [{ scale: withTiming(isPressed.value ? 0.9 : 1) }],
    }
  })

  return (
    <GestureDetector gesture={gesture}>
      <TagItem style={[style, itemStyle]} {...props} />
    </GestureDetector>
  )
}
