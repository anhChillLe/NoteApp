import { useNavigation } from '@react-navigation/native'
import { FC, useState } from 'react'
import {
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  View,
} from 'react-native'
import { Text } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LargeButton } from '~/components/atoms'
import { PasswordTextInput } from '~/components/molecules'
import { Appbar } from '~/components/organisms'

interface Props {
  title: string
  onBackPress: () => void
  onSubmit: (password: string) => void
}

const CreatePasswordLayout: FC<Props> = ({ title, onSubmit, onBackPress }) => {
  const [pw, setPw] = useState('')
  const [rpPw, setRpPw] = useState('')
  const isError = pw !== rpPw && rpPw.length !== 0

  const submit = () => {
    onSubmit(pw)
  }

  return (
    <SafeAreaView style={styles.container}>
      <Appbar onBackPress={onBackPress} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        keyboardVerticalOffset={32}
      >
        <Pressable
          style={styles.container}
          onPress={Keyboard.dismiss}
          pressRetentionOffset={32}
        >
          <View style={styles.content}>
            <Text variant="displaySmall" children={title} />
            <PasswordTextInput
              maxLength={6}
              placeholder="Password"
              value={pw}
              onChangeText={setPw}
            />
            <PasswordTextInput
              maxLength={6}
              placeholder="Repeat password"
              value={rpPw}
              onChangeText={setRpPw}
              error={isError}
            />
            <View style={styles.container} />
            <LargeButton children="Next" mode="contained" onPress={submit} />
          </View>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    gap: 16,
    alignItems: 'stretch',
  },
})

export default CreatePasswordLayout
