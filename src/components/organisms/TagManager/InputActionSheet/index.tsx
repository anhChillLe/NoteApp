import { forwardRef, useState, useImperativeHandle, useRef } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { StyleSheet, TextInput as RNTextInput } from 'react-native'
import { Text, TextInput, Button } from 'react-native-paper'
import { useActionSheetRef, ActionSheet, Row } from '~/components/atoms'

interface DialogProps {
  title: string
  onSubmit: (text: string) => void
  style?: StyleProp<ViewStyle>
}

interface InputSheet {
  show: (text?: string) => void
  hide: () => void
}

export const useInputActionSheet = () => useRef<InputSheet>(null)

export const InputActionSheet = forwardRef<InputSheet, DialogProps>(
  ({ title, onSubmit, style }, ref) => {
    const actionSheet = useActionSheetRef()
    const [text, setText] = useState<string>()
    const show = (text?: string) => {
      actionSheet.current?.show()
      setText(text)
    }
    useImperativeHandle(ref, () => ({ show, hide: actionSheet.current.hide }))

    const handleSubmit = () => {
      if (text) {
        onSubmit(text)
        setText('')
        actionSheet.current.hide()
      }
    }

    return (
      <ActionSheet
        ref={actionSheet}
        dissmisable
        style={[styles.container, style]}
      >
        <Text variant="titleLarge" style={styles.title}>
          {title}
        </Text>
        <TextInput
          mode="outlined"
          placeholder="Tag name"
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleSubmit}
          autoFocus
          dense
        />
        <Row style={styles.button_container}>
          <Button
            mode="outlined"
            style={styles.button}
            compact
            onPress={() => actionSheet.current.hide()}
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
        </Row>
      </ActionSheet>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    margin: 16,
    borderRadius: 16,
    padding: 16,
    gap: 24,
  },
  title: { fontWeight: '600', textAlign: 'center' },
  button: { flex: 1 },
  button_container: { gap: 8 },
})
