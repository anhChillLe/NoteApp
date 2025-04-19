import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  BackHandler,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useTheme } from '../../../styles/ThemeProvider'

interface ModalProps {
  visible: boolean
  overlayAccessibilityLabel?: string
  children: React.ReactNode
  dismissable?: boolean // Hide on press outside
  dismissableBackButton?: boolean // Hide on backpress
  onDismiss?: () => void // On complete hide
  onRequestClose?: () => void // On press outside or backpress
  animationDuration?: number
  transparent?: boolean
  style?: StyleProp<ViewStyle>
  lazy?: boolean
}
const AnimatedPressable = Animated.createAnimatedComponent(Pressable)
const Modal: FC<ModalProps> = ({
  children,
  visible,
  style,
  animationDuration = 220,
  dismissable = true,
  dismissableBackButton = true,
  onDismiss,
  onRequestClose,
  transparent,
  overlayAccessibilityLabel,
  lazy = true,
}) => {
  const { colors } = useTheme()
  const isRendered = useRef(visible)
  const [contentVisible, setContentVisible] = useState(visible)
  const progress = useSharedValue(Number(visible))

  const timmingConfig = useMemo(
    () => ({
      duration: animationDuration,
      easing: Easing.in(Easing.ease),
    }),
    [animationDuration],
  )

  const show = useCallback(() => {
    setContentVisible(true)
    progress.value = withTiming(1, timmingConfig)
  }, [progress, timmingConfig])

  const hide = useCallback(() => {
    progress.value = withTiming(0, timmingConfig, () => {
      onDismiss && runOnJS(onDismiss)()
      runOnJS(setContentVisible)(false)
    })
  }, [progress, timmingConfig, onDismiss])

  useEffect(() => {
    if (visible) {
      isRendered.current = true
      if (contentVisible) return
      show()
    } else {
      if (!isRendered.current || !contentVisible) return
      hide()
    }
  }, [show, hide, visible, contentVisible])

  // Android BackHandler
  useEffect(() => {
    if (!visible) {
      return undefined
    }

    const onHardwareBackPress = () => {
      if (dismissable || dismissableBackButton) {
        onRequestClose?.()
      }
      return true
    }

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onHardwareBackPress,
    )

    return () => subscription.remove()
  }, [dismissable, dismissableBackButton, onRequestClose, visible])

  const backdropStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: colors.backdrop,
      opacity: transparent ? 0 : progress.value,
    }
  }, [transparent])

  // eslint-disable-next-line react-compiler/react-compiler
  if (!isRendered.current && lazy) return null

  return (
    <View
      style={StyleSheet.absoluteFill}
      pointerEvents={contentVisible ? 'auto' : 'none'}
      accessibilityViewIsModal
      accessibilityLiveRegion="polite"
      onAccessibilityEscape={onRequestClose}
      accessibilityLabel={overlayAccessibilityLabel}
    >
      <AnimatedPressable
        style={[backdropStyle, StyleSheet.absoluteFill]}
        accessibilityRole="button"
        importantForAccessibility="no"
        onPress={dismissable ? onRequestClose : undefined}
      />
      <View
        style={[styles.container, style]}
        pointerEvents="box-none"
        children={children}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
})

export default Modal
export type { ModalProps }
