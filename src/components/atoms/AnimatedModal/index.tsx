import {
  FC,
  forwardRef,
  useCallback,
  useEffect,
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
import { SystemBar } from '~/modules'
import { convertToSolidColor, toHex } from '~/styles/material3/color/utils'
import { AnimatedPressable } from '../../Animated'

interface Props extends ModalProps {
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
      onDismiss,
      enteringDuration = 200,
      exitingDuration = 200,
      ...props
    },
    ref,
  ) => {
    const { colors } = useTheme()
    const [visible, setVisible] = useState(false)
    const { progress, start, end } = useProgress()
    const [prevColor, setPrevColor] = useState<string | null>(null)

    const setColor = () => {
      const color = convertToSolidColor(
        colors.inverseSurface,
        colors.background,
        0.38,
      )
      SystemBar.setNavigationBarColor(toHex(color))
    }

    const clearColor = () => {
      prevColor && SystemBar.setNavigationBarColor(prevColor)
    }

    const show = useCallback(
      (options?: Partial<Options>) => {
        const { onCompleteTransition, skipAnimation } = options || {}
        setVisible(true)
        setColor()
        const callback = onCompleteTransition
          ? runOnJS(onCompleteTransition)
          : undefined
        start(enteringDuration, callback)
      },
      [setVisible],
    )

    const hide = useCallback(
      (options?: Partial<Options>) => {
        const { onCompleteTransition, skipAnimation } = options || {}
        clearColor()
        const onComplete = () => {
          'worklet'
          runOnJS(setVisible)(false)
          onCompleteTransition && runOnJS(onCompleteTransition)()
        }
        end(enteringDuration, onComplete)
      },
      [setVisible, prevColor],
    )

    useImperativeHandle(ref, () => ({ show, hide }), [show, hide])

    useEffect(() => {
      setPrevColor(SystemBar.getNavigationBarColor())
      return () => {
        prevColor && SystemBar.setNavigationBarColor(prevColor)
      }
    }, [colors, setPrevColor])

    return (
      <Modal
        visible={visible}
        transparent
        statusBarTranslucent={true}
        {...props}
      >
        <KeyboardAvoidingView
          style={[styles.container, style]}
          behavior="padding"
        >
          <ModalBackdrop onPress={onDismiss} style={{ opacity: progress }} />
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

export { AnimatedModal, useModal }
export type { Options as ModalActionOptions, ModalActions }
