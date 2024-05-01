import {
  FC,
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
  PressableProps,
  StyleSheet,
} from 'react-native'
import { useTheme } from 'react-native-paper'
import { AnimatedProps, runOnJS } from 'react-native-reanimated'
import { useProgress } from '~/hooks'
import { AnimatedPressable } from '../Animated'

interface Props extends ModalProps {
  dissmisable?: boolean
  enteringDuration?: number
  exitingDuration?: number
}

type Options = {
  skipAnimation: boolean
  onCompleteTransition: () => void
}

interface ModalActions {
  show: (options?: Partial<Options>) => void
  hide: (options?: Partial<Options>) => void
}

function useModal() {
  const defaultRef = {
    show: () => {
      console.warn('Ref is not used')
    },
    hide: () => {
      console.warn('Ref is not used')
    },
  }
  return useRef<ModalActions>(defaultRef)
}

const AnimatedModal = forwardRef<ModalActions, Props>(
  (
    {
      style,
      children,
      dissmisable,
      enteringDuration = 200,
      exitingDuration = 200,
      ...props
    },
    ref,
  ) => {
    const [visible, setVisible] = useState(false)
    const { progress, start, end } = useProgress()

    const show = useCallback(
      (options?: Partial<Options>) => {
        const { onCompleteTransition, skipAnimation } = options || {}
        setVisible(true)
        const callback = onCompleteTransition
          ? runOnJS(onCompleteTransition)
          : undefined
        start(enteringDuration, callback)
      },
      [setVisible],
    )

    const hide = useCallback(
      (options?: Partial<Options>) => {
        const { onCompleteTransition } = options || {}
        Keyboard.dismiss()
        const onComplete = () => {
          'worklet'
          runOnJS(setVisible)(false)
          if (typeof onCompleteTransition === 'function') {
            runOnJS(onCompleteTransition)()
          }
        }
        end(enteringDuration, onComplete)
      },
      [setVisible],
    )

    useImperativeHandle(ref, () => ({ show, hide }), [show, hide])

    return (
      <Modal
        visible={visible}
        onRequestClose={() => hide()}
        statusBarTranslucent={false}
        transparent
        {...props}
      >
        <KeyboardAvoidingView
          style={[styles.container, style]}
          behavior="padding"
        >
          <ModalBackdrop
            onPress={dissmisable ? () => hide() : undefined}
            style={{ opacity: progress }}
          />
          {children}
        </KeyboardAvoidingView>
      </Modal>
    )
  },
)

interface BackdropProps extends AnimatedProps<PressableProps> {}

const ModalBackdrop: FC<BackdropProps> = ({ style, ...props }) => {
  const { colors } = useTheme()

  return (
    <AnimatedPressable
      style={[{ backgroundColor: colors.backdrop }, styles.backdrop, style]}
      {...props}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: StyleSheet.absoluteFillObject,
})

export { useModal, AnimatedModal }
export type { Options as ModalActionOptions, ModalActions }
