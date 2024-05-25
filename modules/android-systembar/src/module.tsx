import { NativeModules, Platform } from 'react-native'

const LINKING_ERROR =
  `The package 'react-native-android-systembar' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n'

const UnknownModule = new Proxy(
  {},
  {
    get() {
      throw new Error(LINKING_ERROR)
    },
  },
)

const AndroidSystembar: SystemBar = NativeModules.AndroidSystembar
  ? NativeModules.AndroidSystembar
  : UnknownModule

export default AndroidSystembar
