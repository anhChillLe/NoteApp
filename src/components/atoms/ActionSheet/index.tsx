import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { ModalProps, StyleSheet } from 'react-native'
import { useTheme } from 'react-native-paper'
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { AnimatedModal, useModal } from '../AnimatedModal'

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
    const modal = useModal()

    const [isShowContent, setIsShowContent] = useState(false)

    const show = useCallback(() => {
      setIsShowContent(true)
      modal.current.show()
    }, [modal.current, setIsShowContent])

    const hide = useCallback(() => {
      setIsShowContent(false)
      modal.current.hide()
    }, [modal.current, setIsShowContent])

    useImperativeHandle<ActionSheet, ActionSheet>(ref, () => ({ show, hide }), [
      show,
      hide,
    ])

    return (
      <AnimatedModal
        ref={modal}
        style={styles.container}
        enteringDuration={200}
        exitingDuration={200}
        onDismiss={hide}
        onRequestClose={hide}
        {...props}
      >
        {isShowContent && (
          <Animated.View
            entering={FadeInDown.duration(200)}
            exiting={FadeOutDown.duration(200)}
            style={[
              safeArea && { bottom, left, right },
              { backgroundColor: colors.background },
              style,
            ]}
          >
            {children}
          </Animated.View>
        )}
      </AnimatedModal>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
  },
  backdrop: StyleSheet.absoluteFillObject,
})
