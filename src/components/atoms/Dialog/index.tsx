import { FC, useCallback, useEffect, useState } from 'react'
import {
  ModalProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'
import { trigger } from 'react-native-haptic-feedback'
import { Portal, useTheme } from 'react-native-paper'
import Animated, {
  AnimatedStyle,
  Easing,
  interpolate,
  runOnJS,
  runOnUI,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { AnimatedPressable } from '~/components/Animated'

interface DialogProps extends ModalProps {
  animationDuration?: number
  contentContainerStyle?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>
}

const Dialog: FC<DialogProps> = ({
  children,
  visible,
  style,
  contentContainerStyle,
  animationDuration = 100,
  onDismiss,
}) => {
  const { colors } = useTheme()
  const [contentVisible, setContentVisible] = useState(false)
  const progress = useSharedValue(0)

  const show = useCallback(() => {
    trigger('effectTick')
    runOnUI(() => {
      runOnJS(setContentVisible)(true)
      progress.value = withTiming(1, {
        duration: animationDuration,
        easing: Easing.in(Easing.ease),
      })
    })()
  }, [setContentVisible])

  const hide = useCallback(() => {
    progress.value = withTiming(
      0,
      { duration: animationDuration, easing: Easing.in(Easing.ease) },
      () => {
        runOnJS(setContentVisible)(false)
      },
    )
  }, [setContentVisible])

  useEffect(() => {
    if (visible) {
      show()
    } else {
      hide()
    }
  }, [show, hide, visible])

  const backdropStyle = useAnimatedStyle<ViewStyle>(() => {
    return {
      backgroundColor: colors.backdrop,
      opacity: progress.value,
    }
  })

  const contentStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(progress.value, [0, 1], [32, 0], 'clamp'),
        },
      ],
      opacity: progress.value,
    }
  }, [])

  return (
    <Portal>
      <View
        style={[styles.container, style]}
        pointerEvents={contentVisible ? 'auto' : 'none'}
        accessibilityViewIsModal
        accessibilityLiveRegion="polite"
        onAccessibilityEscape={hide}
      >
        <AnimatedPressable
          style={[backdropStyle, StyleSheet.absoluteFill]}
          accessibilityRole="button"
          importantForAccessibility="no"
          onPress={onDismiss}
        />
        <Animated.View
          style={[
            styles.content_container,
            contentStyle,
            contentContainerStyle,
          ]}
        >
          {children}
        </Animated.View>
      </View>
    </Portal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content_container: {
    paddingHorizontal: 32,
    width: '100%',
  },
})

export default Dialog
export type { DialogProps }
