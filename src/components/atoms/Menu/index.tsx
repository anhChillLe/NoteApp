import React, { FC, useCallback, useEffect } from 'react'
import {
  LayoutChangeEvent,
  LayoutRectangle,
  StyleSheet,
  ViewStyle,
  useWindowDimensions,
} from 'react-native'
import { Portal, useTheme } from 'react-native-paper'
import Animated, {
  AnimatedRef,
  Easing,
  MeasuredDimensions,
  measure,
  runOnUI,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context'
import Modal, { ModalProps } from '../Modal'

interface Props extends ModalProps {
  anchorRef: AnimatedRef<any>
  animationDuration?: number
  safeArea?: boolean
}

const Menu: FC<Props> = ({
  anchorRef,
  animationDuration = 250,
  safeArea = true,
  children,
  visible,
  style,
  ...props
}) => {
  const { colors, roundness } = useTheme()
  const progress = useSharedValue(0)

  const window = useWindowDimensions()
  const anchorMeasurement = useSharedValue<MeasuredDimensions | null>(null)
  const contentLayout = useSharedValue<LayoutRectangle | undefined>(undefined)
  const insets = useSafeAreaInsets()

  const show = useCallback(() => {
    runOnUI(() => (anchorMeasurement.value = measure(anchorRef)))()
    progress.value = withTiming(1, { duration: animationDuration, easing })
  }, [anchorRef.current])

  const hide = useCallback(() => {
    progress.value = withTiming(0, { duration: animationDuration, easing })
  }, [])

  useEffect(() => {
    if (visible) show()
    else hide()
  }, [visible, show, hide])

  const onContentLayout = (e: LayoutChangeEvent) => {
    contentLayout.value = e.nativeEvent.layout
  }

  const contentStyle = useAnimatedStyle<ViewStyle>(() => {
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

  return (
    <Portal>
      <Modal
        visible={visible}
        dismissable
        dismissableBackButton
        lazy={false}
        {...props}
      >
        <Animated.View
          onLayout={onContentLayout}
          style={[styles.content_container, contentStyle, style]}
        >
          {children}
        </Animated.View>
      </Modal>
    </Portal>
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

export default Menu
