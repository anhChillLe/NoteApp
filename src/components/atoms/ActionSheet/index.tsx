import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import {
  Keyboard,
  KeyboardAvoidingView,
  LayoutChangeEvent,
  Modal,
  ModalProps,
  StyleSheet,
} from 'react-native'
import { useTheme } from 'react-native-paper'
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useProgress } from '~/hooks'
import { AnimatedPressable } from '../Animated'

interface Props extends ModalProps {
  dissmisable?: boolean
  enteringDuration?: number
  exitingDuration?: number
  safeArea?: boolean
}

type TransitionCallback = () => void

interface ActionSheet {
  show: (onCompleteTransition?: TransitionCallback) => void
  hide: (onCompleteTransition?: TransitionCallback) => void
}

export function useActionSheetRef() {
  const defaultRef = { show: () => {}, hide: () => {} }
  return useRef<ActionSheet>(defaultRef)
}

export const ActionSheet = forwardRef<ActionSheet, Props>(
  (
    {
      style,
      children,
      dissmisable,
      safeArea = true,
      enteringDuration = 200,
      exitingDuration = 200,
      ...props
    },
    ref,
  ) => {
    const { colors } = useTheme()
    const { bottom, left, right } = useSafeAreaInsets()
    const [visible, setVisible] = useState(false)
    const { progress, start, end } = useProgress()

    const show = useCallback(
      (onCompleteTransition?: TransitionCallback) => {
        setVisible(true)
        const callback = onCompleteTransition
          ? runOnJS(onCompleteTransition)
          : undefined
        start(enteringDuration, callback)
      },
      [setVisible],
    )

    const hide = useCallback(
      (onCompleteTransition?: TransitionCallback) => {
        Keyboard.dismiss()
        const onComplete = () => {
          'worklet'
          runOnJS(setVisible)(false)
          onCompleteTransition && runOnJS(onCompleteTransition)()
        }
        end(enteringDuration, onComplete)
      },
      [setVisible],
    )

    useImperativeHandle<ActionSheet, ActionSheet>(ref, () => ({ show, hide }), [
      show,
      hide,
    ])

    const contentHeight = useSharedValue(0)

    const contentStyle = useAnimatedStyle(() => {
      const translateY = interpolate(
        progress.value,
        [0, 1],
        [contentHeight.value, 0],
      )
      return {
        transform: [{ translateY }],
        opacity: progress.value,
      }
    }, [progress, contentHeight])

    const onContentLayout = (e: LayoutChangeEvent) => {
      contentHeight.value = e.nativeEvent.layout.height
    }

    return (
      <Modal
        visible={visible}
        onRequestClose={() => hide()}
        statusBarTranslucent={false}
        transparent
        {...props}
      >
        <KeyboardAvoidingView style={[styles.container]} behavior="padding">
          <AnimatedPressable
            onPress={dissmisable ? () => hide() : undefined}
            style={[
              { opacity: progress },
              { backgroundColor: colors.backdrop },
              styles.backdrop,
            ]}
          />
          <Animated.View
            onLayout={onContentLayout}
            style={[
              safeArea && { bottom, left, right },
              { backgroundColor: colors.background },
              contentStyle,
              style,
            ]}
          >
            {children}
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  backdrop: StyleSheet.absoluteFillObject,
})
