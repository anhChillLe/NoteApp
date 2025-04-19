import { Platform } from 'react-native'
import RNReactNativeHapticFeedback from 'react-native-haptic-feedback'

export namespace Haptick {
  export function light() {
    RNReactNativeHapticFeedback.trigger(
      Platform.select({ android: 'effectHeavyClick', default: 'impactLight' }),
    )
  }
  export function medium() {
    RNReactNativeHapticFeedback.trigger(
      Platform.select({
        android: 'effectTick',
        default: 'impactMedium',
      }),
    )
  }
  export function heavy() {
    RNReactNativeHapticFeedback.trigger(
      Platform.select({ android: 'effectClick', default: 'impactHeavy' }),
    )
  }
}
