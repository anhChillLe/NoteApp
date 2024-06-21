import { FC, useCallback, useEffect } from 'react'
import { ModalProps, StyleSheet, View } from 'react-native'
import { trigger } from 'react-native-haptic-feedback'
import { Button, Portal, Text, useTheme } from 'react-native-paper'
import Animated, {
  Easing,
  runOnJS,
  runOnUI,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

interface ToastProps extends ModalProps {
  animationDuration?: number
  duration?: number
  gravity?: number
  onDismiss: () => void
}

const Toast: FC<ToastProps> = ({
  children,
  visible,
  style,
  duration = 3000,
  gravity = 0,
  onDismiss,
  animationDuration = 250,
}) => {
  const { colors, roundness } = useTheme()
  const progress = useSharedValue(0)

  const show = useCallback(() => {
    trigger('effectTick')
    runOnUI(() => {
      progress.value = withTiming(1, {
        duration: animationDuration,
        easing: Easing.in(Easing.ease),
      })
    })()
  }, [])

  const hide = useCallback(() => {
    progress.value = withTiming(
      0,
      {
        duration: animationDuration,
        easing: Easing.in(Easing.ease),
      },
      () => {
        runOnJS(onDismiss)()
      },
    )
  }, [])

  useEffect(() => {
    if (visible) {
      show()
    } else {
      hide()
    }
  }, [show, hide, visible])

  const contentStyle = useAnimatedStyle(() => {
    return {
      borderRadius: roundness * 2,
      backgroundColor: colors.primaryContainer,
      opacity: progress.value,
      bottom: gravity,
    }
  }, [gravity, colors, roundness])

  useEffect(() => {
    if (visible) {
      const id = setTimeout(() => {
        hide()
      }, duration)

      return () => clearTimeout(id)
    }
  }, [visible, hide])

  return (
    <Portal>
      <View
        style={[styles.container, style]}
        pointerEvents="none"
        accessibilityViewIsModal
        accessibilityLiveRegion="polite"
        onAccessibilityEscape={hide}
      >
        <Animated.View style={[styles.content_container, contentStyle]}>
          <Text style={{ color: colors.onPrimaryContainer }}>{children}</Text>
        </Animated.View>
      </View>
    </Portal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content_container: {
    position: 'absolute',
    padding: 16,
    left: 32,
    right: 32,
  },
})

export default Toast
export type { ToastProps }
