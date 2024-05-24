import { FC } from 'react'
import { View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { trigger } from 'react-native-haptic-feedback'
import {
  measure,
  runOnJS,
  useAnimatedRef,
  useSharedValue,
} from 'react-native-reanimated'
import { TagItem } from '~/components/molecules'
import { useDragingHome } from '../..'

interface Props extends React.ComponentProps<typeof TagItem> {
  onDragStart?: () => void
  onDragEnd?: () => void
}
export const DragableTagItem: FC<Props> = ({
  onDragStart,
  onDragEnd,
  ...props
}) => {
  const ref = useAnimatedRef<View>()
  const isPressed = useSharedValue(false)
  const { gesturePayload, target, setDragingTag } = useDragingHome()

  const gesture = Gesture.Pan()
    .activateAfterLongPress(250)
    .onBegin(e => {
      target.value = measure(ref)
    })
    .onStart(e => {
      gesturePayload.value = e
      onDragStart && runOnJS(onDragStart)()
      runOnJS(trigger)('effectTick')
    })
    .onUpdate(e => {
      gesturePayload.value = e
    })
    .onEnd(e => {
      onDragEnd && runOnJS(onDragEnd)()
      gesturePayload.value = undefined
    })
    .onFinalize(e => {
      isPressed.value = false
      target.value = undefined
      runOnJS(setDragingTag)(undefined)
    })

  return (
    <GestureDetector gesture={gesture}>
      <TagItem delayLongPress={250} ref={ref} {...props} />
    </GestureDetector>
  )
}
