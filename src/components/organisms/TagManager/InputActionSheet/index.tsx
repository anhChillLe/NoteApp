import { FC } from 'react'
import {
  ModalProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'
import { Button, Text, TextInput } from 'react-native-paper'
import { ActionSheet } from '~/components/atoms/ActionSheet'

interface Props extends ModalProps {
  title: string
  onSubmit: (text: string) => void
  style?: StyleProp<ViewStyle>
  visible: boolean
  text?: string
  onChangeText: (text: string) => void
}

export const InputActionSheet: FC<Props> = ({
  title,
  onSubmit,
  style,
  visible,
  text,
  onChangeText,
  onDismiss,
  ...props
}) => {
  const handleSubmit = () => {
    if (text) {
      onSubmit(text)
      onDismiss?.()
    }
  }

  return (
    <ActionSheet
      visible={visible}
      style={[styles.container, style]}
      onDismiss={onDismiss}
      {...props}
    >
      <Text variant="titleLarge" style={styles.title}>
        {title}
      </Text>
      <TextInput
        mode="outlined"
        placeholder="Tag name"
        value={text}
        onChangeText={onChangeText}
        onSubmitEditing={handleSubmit}
        dense
      />
      <View style={styles.button_container}>
        <Button
          mode="outlined"
          style={styles.button}
          compact
          onPress={onDismiss}
        >
          Cancel
        </Button>
        <Button
          mode="contained"
          style={styles.button}
          compact
          onPress={handleSubmit}
        >
          Ok
        </Button>
      </View>
    </ActionSheet>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    borderRadius: 16,
    padding: 16,
    gap: 24,
  },
  title: { fontWeight: '600', textAlign: 'center' },
  button: { flex: 1 },
  button_container: { gap: 8, flexDirection: 'row' },
})
