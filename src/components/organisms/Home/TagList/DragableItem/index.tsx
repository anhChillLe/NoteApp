import { FC } from 'react'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import { TagItem } from '~/components/molecules'
import { Offset, useHome } from '../../Provider'

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
  const relativeOffset = useSharedValue<Offset>({ x: 0, y: 0 })
  const { offset, lastOffset } = useHome()

  const gesture = Gesture.Pan()
    .activateAfterLongPress(200)
    .onBegin(() => {
      isPressed.value = true
    })
    .onStart(() => {
      onDragStart && runOnJS(onDragStart)()
    })
    .onUpdate(e => {
      relativeOffset.value = {
        x: e.translationX,
        y: e.translationY,
      }
      offset.value = {
        x: e.absoluteX,
        y: e.absoluteY,
      }
    })
    .onEnd(e => {
      onDragEnd && runOnJS(onDragEnd)()
    })
    .onFinalize(e => {
      relativeOffset.value = { x: 0, y: 0 }
      isPressed.value = false
      offset.value = undefined
      lastOffset.value = {
        x: e.absoluteX,
        y: e.absoluteY,
      }
    })

  const itemStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: isPressed.value ? 0.9 : 1 },
        { translateX: relativeOffset.value.x },
        { translateY: relativeOffset.value.y },
      ],
    }
  })

  return (
    <GestureDetector gesture={gesture}>
      <TagItem style={[style, itemStyle]} {...props} />
    </GestureDetector>
  )
}
