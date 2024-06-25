import { FC, PropsWithChildren, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { Portal, Text, useTheme } from 'react-native-paper'
import Animated, {
  FadeInDown,
  FadeOutDown,
  useAnimatedStyle,
} from 'react-native-reanimated'

interface ToastProps {
  visible: boolean
  onRequestClose: () => void
  duration?: number
  gravity?: number
  animationDuration?: number
}

const Toast: FC<PropsWithChildren<ToastProps>> = ({
  children,
  visible,
  duration = 3000,
  gravity = 128,
  onRequestClose,
  animationDuration = 160,
}) => {
  const { colors, roundness } = useTheme()

  useEffect(() => {
    if (visible) {
      const id = setTimeout(onRequestClose, duration)
      return () => clearTimeout(id)
    }
  }, [visible, onRequestClose])

  return (
    <Portal>
      <View style={styles.container} pointerEvents="none">
        {visible && (
          <Animated.View
            entering={FadeInDown.duration(animationDuration)}
            exiting={FadeOutDown.duration(animationDuration)}
            style={[
              styles.content_container,
              {
                borderRadius: roundness * 2,
                backgroundColor: colors.surfaceVariant,
                bottom: gravity,
              },
            ]}
          >
            <Text
              style={{ color: colors.onSurfaceVariant }}
              children={children}
            />
          </Animated.View>
        )}
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
