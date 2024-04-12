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
  Modal,
  ModalProps,
  Platform,
  StyleSheet,
} from 'react-native'
import { useTheme } from 'react-native-paper'
import {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { AnimatedPressable } from '../Animated'

interface Props extends ModalProps {
  dissmisable?: boolean
  enteringDuration?: number
  exitingDuration?: number
  safeArea?: boolean
}

interface ActionSheet {
  show: () => void
  hide: () => void
}

export function useActionSheetRef() {
  const defaultRef = { show: () => {}, hide: () => {} }
  return useRef(defaultRef)
}

function useProgress() {
  const progress = useSharedValue(0)
  const start = (duration: number, onFinish?: () => void) => {
    progress.value = withTiming(1, { duration }, onFinish)
  }
  const end = (duration: number, onFinish?: () => void) => {
    progress.value = withTiming(0, { duration }, onFinish)
  }

  return { progress, start, end }
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

    const show = useCallback(() => {
      runOnJS(setVisible)(true)
      start(enteringDuration)
    }, [setVisible])

    const hide = useCallback(() => {
      Keyboard.dismiss()
      end(enteringDuration, () => {
        'worklet'
        runOnJS(setVisible)(false)
      })
    }, [setVisible])

    useImperativeHandle(ref, () => ({ show, hide }), [show, hide])

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

    return (
      <Modal
        visible={visible}
        onRequestClose={hide}
        statusBarTranslucent={false}
        transparent
        {...props}
      >
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          <AnimatedPressable
            onPress={dissmisable ? hide : undefined}
            style={[
              { opacity: progress },
              { backgroundColor: colors.backdrop },
              styles.backdrop,
            ]}
          />
          <AnimatedPressable
            onLayout={e => {
              contentHeight.value = e.nativeEvent.layout.height
            }}
            style={[
              safeArea && { bottom, left, right },
              { backgroundColor: colors.background },
              contentStyle,
              style,
            ]}
          >
            {children}
          </AnimatedPressable>
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
