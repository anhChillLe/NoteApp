import { FC, PropsWithChildren, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { Portal, Text } from '../../atoms'
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated'
import { useTheme } from '../../../styles/ThemeProvider'

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
  }, [visible, onRequestClose, duration])

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
                borderRadius: roundness * 4,
                backgroundColor: colors.surfaceVariant,
                bottom: gravity,
              },
            ]}
          >
            <Text
              style={[styles.content, { color: colors.onSurfaceVariant }]}
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
    margin: 32,
    alignItems: 'center',
  },
  content_container: {
    position: 'absolute',
    padding: 16,
  },
  content: {
    textAlign: 'center',
    fontWeight: '500',
  },
})

export default Toast
export type { ToastProps }
