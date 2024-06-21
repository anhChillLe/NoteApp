import { FC } from 'react'
import {
  ModalProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'
import { Button, Text, TextInput, useTheme } from 'react-native-paper'
import ActionSheet from '~/components/atoms/ActionSheet'
import Shape from '~/components/atoms/Shape'

interface Props extends ModalProps {
  title: string
  onSubmit: (text: string) => void
  style?: StyleProp<ViewStyle>
  visible: boolean
  text?: string
  onChangeText: (text: string) => void
}

const InputSheet: FC<Props> = ({
  title,
  onSubmit,
  style,
  visible,
  text,
  onChangeText,
  onDismiss,
  ...props
}) => {
  const { roundness } = useTheme()
  const handleSubmit = () => {
    if (text) {
      onSubmit(text)
      onDismiss?.()
    }
  }

  return (
    <ActionSheet
      visible={visible}
      safeArea
      style={[style]}
      onDismiss={onDismiss}
      {...props}
    >
      <Shape style={styles.container} roundnessLevel={5}>
        <Text variant="titleLarge" style={styles.title}>
          {title}
        </Text>
        <TextInput
          mode="outlined"
          placeholder="Tag name"
          value={text}
          outlineStyle={{ borderRadius: roundness * 3 }}
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
      </Shape>
    </ActionSheet>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    padding: 24,
    gap: 24,
  },
  title: {
    fontWeight: '600',
    textAlign: 'center',
  },
  button: {
    flex: 1,
  },
  button_container: {
    gap: 16,
    flexDirection: 'row',
  },
})

export default InputSheet
