import {
  Component,
  Dispatch,
  FC,
  ForwardRefExoticComponent,
  PropsWithChildren,
  PropsWithoutRef,
  ReactElement,
  RefAttributes,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import {
  Gesture,
  GestureDetector,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler'
import {
  Easing,
  MeasuredDimensions,
  SharedValue,
  WithTimingConfig,
  measure,
  runOnJS,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

export type Position = GestureUpdateEvent<PanGestureHandlerEventPayload>

interface DragData<T> {
  extras: T | null
  setExtras: Dispatch<SetStateAction<T | null>>
  target: SharedValue<MeasuredDimensions | null>
  position: SharedValue<Position | null>
}

const DragContext = createContext<DragData<any>>(
  null as unknown as DragData<any>,
)

function useDrag<T>(): DragData<T> {
  const context = useContext(DragContext)
  if (!context) {
    throw new Error('useDrag must be used within a DragingProvider')
  }
  return context as DragData<T>
}

const DragProvider: FC<PropsWithChildren> = <T,>({
  children,
}: PropsWithChildren): ReactElement => {
  const [extras, setExtras] = useState<T | null>(null)
  const position = useSharedValue<Position | null>(null)
  const target = useSharedValue<MeasuredDimensions | null>(null)

  const value: DragData<T> = {
    position,
    target,
    extras,
    setExtras,
  }

  return <DragContext.Provider value={value} children={children} />
}

type DetectGestureProps<T> = T & {
  onActiveDrag: () => void
  onInactiveDrag: () => void
}

type ComponentWithRef<T extends Component, P> = FC<
  PropsWithoutRef<P> & RefAttributes<T>
>

function createDetectGestureItem<P>(
  WrappedComponent: ComponentWithRef<View, P>,
) {
  function DetectedGestureItem<T>({
    onActiveDrag,
    onInactiveDrag,
    ...props
  }: DetectGestureProps<P>) {
    const ref = useAnimatedRef<View>()
    const { position, target } = useDrag<T>()

    const gesture = useMemo(() => {
      return Gesture.Pan()
        .activateAfterLongPress(250)
        .onBegin(() => {
          // eslint-disable-next-line react-compiler/react-compiler
          target.value = measure(ref)
        })
        .onStart(() => {
          runOnJS(onActiveDrag)()
        })
        .onUpdate(e => {
          position.value = e
        })
        .onEnd(() => {
          position.value = null
          target.value = null
        })
        .onFinalize(() => {
          runOnJS(onInactiveDrag)()
        })
    }, [target, ref, onActiveDrag, position, onInactiveDrag])

    return (
      <GestureDetector gesture={gesture}>
        <WrappedComponent ref={ref} {...(props as any)} />
      </GestureDetector>
    )
  }
  return DetectedGestureItem
}

function createDropableItem<P extends { style?: StyleProp<ViewStyle> }>(
  WrappedComponent: ComponentWithRef<View, P>,
) {
  function DropableItem({
    onDropIn,
    onDragIn,
    style,
    ...props
  }: P & { onDropIn: () => void; onDragIn?: () => void }) {
    const ref = useAnimatedRef<View>()

    const getRec = useCallback(() => {
      'worklet'
      return measure(ref)
    }, [ref])

    const isDragIn = useDrop(getRec, onDropIn)

    useAnimatedReaction(
      () => isDragIn.value,
      value => {
        value && onDragIn && runOnJS(onDragIn)()
      },
    )

    const itemStyle = useAnimatedStyle(() => {
      const scaleValue = withTiming(isDragIn.value ? 0.95 : 1, timingConfig)
      return {
        transform: [{ scale: scaleValue }],
        opacity: scaleValue,
      }
    }, [])

    return (
      <WrappedComponent
        ref={ref}
        style={[itemStyle, style]}
        {...(props as any)}
      />
    )
  }
  return DropableItem
}

const timingConfig: WithTimingConfig = {
  duration: 200,
  easing: Easing.out(Easing.cubic),
}

function useDrop<T>(
  getRect: () => MeasuredDimensions | null,
  onSubmitDrop: () => void,
) {
  const { position } = useDrag<T>()

  const isDragIn = useSharedValue(false)

  useAnimatedReaction(
    () => position.value,
    value => {
      if (!value) {
        isDragIn.value = false
        return
      }

      const measurement = getRect()
      if (!measurement) {
        isDragIn.value = false
        return
      }

      isDragIn.value = isInRec(value, measurement)
    },
    [getRect],
  )

  useAnimatedReaction(
    () => position.value,
    (value, preValue) => {
      if (!value && preValue && isInRec(preValue, getRect())) {
        runOnJS(onSubmitDrop)()
      }
    },
    [getRect, onSubmitDrop],
  )

  return isDragIn
}

const isInRec = (
  position: Position | null,
  measurement: MeasuredDimensions | null,
) => {
  'worklet'
  if (!position || !measurement) return false
  const { absoluteX, absoluteY } = position
  const { pageX, pageY, width, height } = measurement
  const inX = absoluteX > pageX && absoluteX < pageX + width
  const inY = absoluteY > pageY && absoluteY < pageY + height
  return inX && inY
}

export {
  DragProvider,
  createDetectGestureItem,
  createDropableItem,
  useDrag,
  useDrop,
}
