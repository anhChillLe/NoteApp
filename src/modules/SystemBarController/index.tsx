import { NativeModules } from 'react-native'
const { SystemBarController } = NativeModules

/**
 * Android module only
 */
interface SystemBarController {
  /**
   * HexColor only
   */
  setNavigationBarColor: (color: string) => void
  /**
   * HexColor only
   */
  setStatusBarColor: (color: string) => void

  getStatusBarColor: () => string | null

  getNavigationBarColor: () => string | null
}

const defaultModule: SystemBarController = {
  setNavigationBarColor: () => {},
  setStatusBarColor: () => {},
  getStatusBarColor: function () {
    console.warn('This modlule is android support only')
    return null
  },
  getNavigationBarColor: function () {
    console.warn('This modlule is android support only')
    return null
  },
}

export default (SystemBarController ?? defaultModule) as SystemBarController
