import React, { FC, useCallback, useEffect, useState } from 'react'
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  LayoutRectangle,
  ModalProps,
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
import { AnimatedPressable } from '~/components/Animated'
import { useLayout } from '~/hooks'

interface Props extends ModalProps {
  anchorRef: AnimatedRef<any>
  animationDuration?: number
}

export const Menu: FC<Props> = ({
  children,
  anchorRef,
  visible,
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
      ...getStyle(anchorMeasurement.value, window, contentLayout.value),
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

  const containerStyle = useAnimatedStyle<ViewStyle>(() => {
    return {}
  }, [])

  return (
    <>
      <Portal>
        <Animated.View
          style={[StyleSheet.absoluteFill, containerStyle]}
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
                transformOrigin: callculateSide(
                  anchorMeasurement.value,
                  window,
                  contentLayout.value,
                ),
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

function callculateSide(
  anchor?: MeasuredDimensions | null,
  window?: ScaledSize | null,
  content?: { width: number; height: number } | null,
) {
  'worklet'
  if (!anchor || !window) return 'left top'

  const { pageX, pageY, width, height } = anchor
  const { width: windowWidth, height: windowHeight } = window

  const isLeft = pageX < windowWidth / 2
  const isTop = pageY < windowHeight / 2

  const horizontal = (() => {
    if (content) {
      const fromLeft = isLeft
        ? anchor.width / 2
        : content.width - anchor.width / 2
      const aspectRatio = Math.round((fromLeft / content.width) * 100)
      return `${aspectRatio}%`
    } else {
      return isLeft ? 'left' : 'right'
    }
  })()

  const vertical = isTop ? 'top' : 'bottom'
  const side = horizontal + ' ' + vertical
  return side
}

function getStyle(
  anchor?: MeasuredDimensions | null,
  window?: ScaledSize | null,
  content?: { width: number; height: number } | null,
): ViewStyle {
  'worklet'
  if (!anchor || !window || !content) return {}

  const { pageX, pageY, width: anchorWidth, height: anchorHeight } = anchor
  const { width: windowWidth, height: windowHeight } = window

  const isLeft = pageX < windowWidth / 2
  const isTop = pageY < windowHeight / 2

  const left = pageX
  const right = window.width - pageX - anchorWidth
  const top = pageY + anchorHeight + 8
  const bottom = window.height - pageY + 8

  return {
    left: isLeft ? left : undefined,
    right: isLeft ? undefined : right,
    top: isTop ? top : undefined,
    bottom: isTop ? undefined : bottom,
  }
}
