import React, { FC, useCallback, useEffect, useState } from 'react'
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  LayoutRectangle,
  ModalProps,
  PressableProps,
  ScaledSize,
  StyleSheet,
  ViewStyle,
  useWindowDimensions,
} from 'react-native'
import { trigger } from 'react-native-haptic-feedback'
import { Portal, useTheme, Modal } from 'react-native-paper'
import Animated, {
  AnimatedRef,
  Easing,
  MeasuredDimensions,
  interpolate,
  measure,
  runOnJS,
  runOnUI,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context'
import { AnimatedPressable } from '~/components/Animated'
import { useLayout } from '~/hooks'

interface Props extends ModalProps {
  anchorRef: AnimatedRef<any>
  animationDuration?: number
  safeArea?: boolean
}

export const Menu: FC<Props> = ({
  children,
  anchorRef,
  visible,
  safeArea = true,
  style,
  animationDuration: duration = 250,
  onDismiss,
}) => {
  const { colors, roundness } = useTheme()
  const progress = useSharedValue(0)
  const [contentVisible, setContentVisible] = useState(false)

  const window = useWindowDimensions()
  const anchorMeasurement = useSharedValue<MeasuredDimensions | null>(null)
  const contentLayout = useSharedValue<LayoutRectangle | undefined>(undefined)
  const insets = useSafeAreaInsets()

  const show = useCallback(() => {
    trigger('effectTick')
    runOnUI(() => {
      anchorMeasurement.value = measure(anchorRef)
      runOnJS(setContentVisible)(true)
      progress.value = withTiming(1, { duration, easing })
    })()
  }, [setContentVisible, anchorRef.current])

  const hide = useCallback(() => {
    progress.value = withTiming(0, { duration, easing }, () => {
      runOnJS(setContentVisible)(false)
    })
  }, [setContentVisible])

  useEffect(() => {
    if (visible) show()
    else hide()
  }, [visible, show, hide])

  const onContentLayout = useCallback((e: LayoutChangeEvent) => {
    contentLayout.value = e.nativeEvent.layout
  }, [])

  const contentStyle = useAnimatedStyle<ViewStyle>(() => {
    if (anchorMeasurement.value === null) return {}
    return {
      ...getPosition(
        anchorMeasurement.value,
        window,
        contentLayout.value,
        safeArea ? insets : undefined,
      ),
      backgroundColor: colors.background,
      borderRadius: roundness * 3,
      transform: [{ scale: progress.value }],
      opacity: progress.value,
    }
  }, [colors, roundness, window, contentLayout])

  const backdropStyle = useAnimatedStyle<ViewStyle>(() => {
    return {
      backgroundColor: colors.backdrop,
      opacity: progress.value / 2,
    }
  })

  return (
    <>
      <Portal>
        <Animated.View
          style={StyleSheet.absoluteFill}
          accessibilityViewIsModal
          accessibilityLiveRegion="polite"
          onAccessibilityEscape={hide}
          pointerEvents={contentVisible ? 'auto' : 'none'}
        >
          <AnimatedPressable
            style={[backdropStyle, styles.backdrop]}
            accessibilityRole="button"
            importantForAccessibility="no"
            onPress={onDismiss}
          />
          <Animated.View
            onLayout={onContentLayout}
            style={[
              {
                opacity: contentVisible ? 1 : 0,
              },
              styles.content_container,
              contentStyle,
              style,
            ]}
          >
            {children}
          </Animated.View>
        </Animated.View>
      </Portal>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content_container: {
    position: 'absolute',
  },
  backdrop: {
    flex: 1,
  },
})

const easing = Easing.out(Easing.poly(2))

function getPosition(
  anchor?: MeasuredDimensions | null,
  window?: { width: number; height: number } | null,
  content?: { width: number; height: number } | null,
  insets: EdgeInsets = { bottom: 0, top: 0, left: 0, right: 0 },
): ViewStyle {
  'worklet'
  if (!anchor || !window || !content) return {}

  let top: number
  let bottom: number | undefined = undefined
  let left: number
  let right: number | undefined = undefined

  const safeHeight = window.height - insets.top - insets.bottom
  const safeWidth = window.width - insets.left - insets.right
  const isLeft = anchor.pageX + anchor.width / 2 < window.width / 2

  if (content.height >= safeHeight) {
    top = insets.top
    bottom = insets.bottom
  } else if (
    content.height >
    window.height - insets.bottom - anchor.pageY - anchor.height
  ) {
    top = window.height - content.height - insets.bottom
  } else {
    top = anchor.pageY + anchor.height
  }

  if (content.width >= safeWidth) {
    left = insets.left
    right = insets.right
  } else if (isLeft) {
    if (content.width > window.width - insets.right - anchor.pageX) {
      left = window.width - content.width
    } else {
      left = anchor.pageX
    }
  } else {
    if (content.width > anchor.pageX + anchor.width - insets.left) {
      left = insets.left
    } else {
      left = anchor.pageX + anchor.width - content.width
    }
  }

  const fromLeft = anchor.pageX + anchor.width / 2 - left
  const fromTop = anchor.pageY + anchor.height / 2 - top

  return {
    top,
    left,
    bottom,
    right,
    transformOrigin: [fromLeft, fromTop, 0],
  }
}
