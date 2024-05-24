import React, { FC, useCallback, useEffect, useState } from 'react'
import {
  KeyboardAvoidingView,
  ModalProps,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'
import { trigger } from 'react-native-haptic-feedback'
import { Portal, useTheme } from 'react-native-paper'
import Animated, {
  Easing,
  SlideInDown,
  SlideOutDown,
  interpolate,
  runOnJS,
  runOnUI,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { AnimatedPressable } from '~/components/Animated'
import { useLayout, useSafeAreaPadding } from '~/hooks'

interface Props extends ModalProps {
  animationDuration?: number
}

export const ActionSheet: FC<Props> = ({
  children,
  visible,
  style,
  animationDuration = 150,
  onDismiss,
}) => {
  const { colors, roundness } = useTheme()
  const safeAreaStyle = useSafeAreaPadding()

  const progress = useSharedValue(0)
  const [layout, onLayout] = useLayout()
  const [contentVisible, setContentVisible] = useState(false)

  const show = useCallback(() => {
    trigger('effectTick')
    runOnUI(() => {
      runOnJS(setContentVisible)(true)
      progress.value = withTiming(1, {
        duration: animationDuration,
        easing: Easing.linear,
      })
    })()
  }, [setContentVisible])

  const hide = useCallback(() => {
    progress.value = withTiming(
      0,
      { duration: animationDuration, easing: Easing.linear },
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

  useEffect(() => {
    runOnUI(() => {
      progress.addListener(0, value => runOnJS(console.log)(value))
    })

    return runOnUI(() => {
      progress.removeListener(0)
    })
  }, [])

  const backdropStyle = useAnimatedStyle<ViewStyle>(() => {
    return {
      backgroundColor: colors.backdrop,
      opacity: progress.value,
    }
  })

  const contentStyle = useAnimatedStyle<ViewStyle>(() => {
    const height = layout?.height ?? 0
    const translateY = interpolate(progress.value, [0, 1], [height, 0])
    return {
      transform: [{ translateY }],
      opacity: progress.value == 0 ? 0 : 1,
    }
  }, [layout])

  return (
    <>
      <Portal>
        <KeyboardAvoidingView
          style={[styles.container, safeAreaStyle]}
          pointerEvents={contentVisible ? 'auto' : 'none'}
          accessibilityViewIsModal
          accessibilityLiveRegion="polite"
          onAccessibilityEscape={hide}
          behavior="padding"
        >
          <AnimatedPressable
            style={[backdropStyle, StyleSheet.absoluteFill]}
            accessibilityRole="button"
            importantForAccessibility="no"
            onPress={onDismiss}
          />
          <Animated.View
            onLayout={onLayout}
            style={[
              {
                backgroundColor: colors.background,
                borderRadius: roundness * 3,
              },
              styles.content_container,
              contentStyle,
              style,
            ]}
          >
            {children}
          </Animated.View>
        </KeyboardAvoidingView>
      </Portal>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  content_container: {
    padding: 16,
    gap: 8,
  },
  backdrop: {
    flex: 1,
  },
})
