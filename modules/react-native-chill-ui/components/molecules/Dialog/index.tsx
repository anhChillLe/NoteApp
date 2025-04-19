import { FC } from 'react'
import {
  KeyboardAvoidingView,
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native'
import Animated, {
  EntryExitAnimationFunction,
  FadeInDown,
  FadeOutDown,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Modal, ModalProps, Portal, Text, TextProps } from '../../atoms'
import { useTheme } from '../../../styles/ThemeProvider'

interface DialogProps extends ModalProps {
  contentContainerStyle?: StyleProp<ViewStyle>
  safeArea?: boolean
  entering?: EntryExitAnimationFunction
  exiting?: EntryExitAnimationFunction
}

type Dialog = FC<DialogProps> & {
  Title: FC<TextProps>
  Content: FC<ViewProps>
  Actions: FC<ViewProps>
}

const Dialog: Dialog = ({
  children,
  contentContainerStyle,
  animationDuration = 120,
  style,
  entering = FadeInDown.duration(animationDuration),
  exiting = FadeOutDown.duration(animationDuration),
  safeArea = true,
  ...props
}) => {
  const { colors, roundness } = useTheme()
  const insets = useSafeAreaInsets()

  return (
    <Portal>
      <Modal {...props} animationDuration={animationDuration}>
        <KeyboardAvoidingView
          style={styles.fill}
          behavior="padding"
          pointerEvents="box-none"
        >
          <View
            style={[
              styles.container,
              safeArea && {
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
                paddingLeft: insets.left,
                paddingRight: insets.right,
              },
              style,
            ]}
            pointerEvents="box-none"
          >
            {props.visible && (
              <Animated.View
                entering={entering}
                exiting={exiting}
                style={[
                  styles.content_container,
                  {
                    borderRadius: roundness * 5,
                    backgroundColor: colors.background,
                  },
                  contentContainerStyle,
                ]}
                children={children}
              />
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </Portal>
  )
}

const DialogTitle: FC<TextProps> = ({ style, ...props }) => {
  return <Text variant="titleLarge" style={[styles.title, style]} {...props} />
}

const DialogContent: FC<ViewProps> = ({ style, ...props }) => {
  return <View style={[styles.content, style]} {...props} />
}

const DialogActions: FC<ViewProps> = ({ style, ...props }) => {
  return <View style={[styles.actions, style]} {...props} />
}

Dialog.Title = DialogTitle
Dialog.Content = DialogContent
Dialog.Actions = DialogActions

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  content_container: {
    padding: 20,
    margin: 16,
    gap: 8,
  },
  title: {
    fontWeight: '700',
  },
  content: {
    gap: 4,
  },
  actions: {
    flexDirection: 'row-reverse',
    gap: 12,
    marginTop: 12,
  },
  fill: {
    flex: 1,
  },
})

export default Dialog
export type { DialogProps }
