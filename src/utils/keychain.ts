import * as Keychain from 'react-native-keychain'

const authenticate = async () => {
  try {
    const options: Keychain.Options = {
      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
      authenticationPrompt: {
        title: 'Finger print access',
        subtitle: 'Use your fingerprint or device passcode',
        description:
          'We need to verify your identity to access your secure notes',
      },
    }

    const credentials = await Keychain.getGenericPassword(options)
    return credentials
  } catch (error) {
    return null
  }
}

const savePassword = async (username: string, password: string) => {
  try {
    const results = await Keychain.setGenericPassword(username, password, {
      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
      authenticationPrompt: {
        title: 'Xác thực để lưu mật khẩu',
        subtitle: 'Sử dụng dấu vân tay hoặc mật khẩu thiết bị của bạn',
        description: 'Chúng tôi cần xác thực để bảo vệ thông tin của bạn',
        cancel: 'Hủy bỏ',
      },
    })
    return results
  } catch (error) {
    return null
  }
}

export { savePassword, authenticate }
