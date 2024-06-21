import React, { FC, useCallback, useEffect, useState } from 'react'
import {
  KeyboardAvoidingView,
  ModalProps,
  StyleSheet,
  ViewStyle,
} from 'react-native'
import { trigger } from 'react-native-haptic-feedback'
import { Portal, useTheme } from 'react-native-paper'
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  runOnUI,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { AnimatedPressable } from '~/components/Animated'
import { useLayout, useSafeAreaPadding } from '~/hooks'

interface Props extends ModalProps {
  animationDuration?: number
  safeArea?: boolean
}

const ActionSheet: FC<Props> = ({
  children,
  visible,
  style,
  animationDuration = 150,
  safeArea = true,
  onDismiss,
}) => {
  const { colors } = useTheme()
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
          style={styles.container}
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
              styles.content_container,
              contentStyle,
              safeArea ? safeAreaStyle : undefined,
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
export default ActionSheet
