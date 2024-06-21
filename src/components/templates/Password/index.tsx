import { FC, useEffect, useState } from 'react'
import {
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  View,
} from 'react-native'
import {
  Button,
  Icon,
  IconButton,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LargeButton } from '~/components/atoms'
import { PasswordTextInput } from '~/components/molecules'
import { Appbar } from '~/components/organisms'
import * as Keychain from 'react-native-keychain'

interface Props {
  onBackPress: () => void
  onSubmit: (password: string) => void
  withBiometric?: boolean
  onBioPress?: () => void
  onForgotPasswordPress?: () => void
}

const PasswordLayout: FC<Props> = ({
  onSubmit,
  withBiometric,
  onBioPress,
  onBackPress,
  onForgotPasswordPress,
}) => {
  const { colors, roundness } = useTheme()
  const [value, setValue] = useState('')
  const submit = () => onSubmit(value)
  const [type, setType] = useState<Keychain.BIOMETRY_TYPE | null>(null)

  useEffect(() => {
    Keychain.getSupportedBiometryType().then(setType)
  }, [setType])

  return (
    <SafeAreaView style={styles.container}>
      <Appbar onBackPress={onBackPress} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        keyboardVerticalOffset={32}
      >
        <Pressable style={styles.container} onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            <View style={styles.input_container}>
              <View style={styles.input_wrapper}>
                <Text variant="headlineMedium" style={styles.input_title}>
                  Enter password
                </Text>
                <PasswordTextInput
                  style={styles.input}
                  placeholder="Password"
                  value={value}
                  onChangeText={setValue}
                  autoFocus={!withBiometric}
                  onSubmitEditing={submit}
                />
                <Button
                  children="Forgot password?"
                  onPress={onForgotPasswordPress}
                />
              </View>
            </View>
            <View style={styles.bio_wrapper}>
              {!!withBiometric && type !== null && (
                <TouchableRipple
                  style={[
                    styles.bio_container,
                    {
                      borderRadius: roundness * 5,
                      backgroundColor: colors.surfaceVariant,
                    },
                  ]}
                  borderless
                  onPress={onBioPress}
                >
                  <Icon
                    source={iconMap[type]}
                    size={48}
                    color={colors.onSurfaceVariant}
                  />
                </TouchableRipple>
              )}
            </View>
            <LargeButton mode="contained" onPress={submit} children="Ok" />
          </View>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const iconMap: Record<Keychain.BIOMETRY_TYPE, string> = {
  [Keychain.BIOMETRY_TYPE.TOUCH_ID]: 'fingerprint',
  [Keychain.BIOMETRY_TYPE.FACE_ID]: 'user',
  [Keychain.BIOMETRY_TYPE.OPTIC_ID]: 'fingerprint',
  [Keychain.BIOMETRY_TYPE.FINGERPRINT]: 'fingerprint',
  [Keychain.BIOMETRY_TYPE.FACE]: 'user',
  [Keychain.BIOMETRY_TYPE.IRIS]: 'eye',
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    padding: 24,
  },
  input_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  input_wrapper: {
    gap: 16,
    alignItems: 'center',
  },
  input: {
    width: '100%',
  },
  input_title: {},
  bio_wrapper: {
    alignItems: 'center',
    padding: 32,
  },
  bio_container: {
    padding: 16,
  },
})

export default PasswordLayout
