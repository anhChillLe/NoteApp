import { Platform } from 'react-native'
import AndroidSystembar from './module'

namespace SystemBarAndroid {
  export const setNavigationBarColor = (color: string) => {
    AndroidSystembar.setNavigationBarColor(color)
  }
  export const animatedStatusBarColor = (
    color: string,
    duration: number = 200,
  ) => {
    AndroidSystembar.animatedStatusBarColor(color, duration)
  }
  export const setIsDarkStatusBar = (isLight: boolean) => {
    AndroidSystembar.setIsAppearanceLightStatusBars(isLight)
  }
  export const setIsDarkNavigationBar = (isLight: boolean) => {
    AndroidSystembar.setIsAppearanceLightNavigationBars(isLight)
  }
  export const animatedNavigationBarColor = (
    color: string,
    duration: number = 200,
  ) => {
    AndroidSystembar.animatedNavigationBarColor(color, duration)
  }
  export const animatedSystemBarColor = (
    color: string,
    duration: number = 200,
  ) => {
    AndroidSystembar.animatedSystemBarColor(color, duration)
  }
  export const getNavigationBarColor = () => {
    return AndroidSystembar.getNavigationBarColor()
  }
  export const setStatusBarColor = (color: string) => {
    AndroidSystembar.setStatusBarColor(color)
  }
  export const getStatusBarColor = () => {
    return AndroidSystembar.getStatusBarColor()
  }
  export const hideStatusBar = () => {
    AndroidSystembar.hideStatusBar()
  }
  export const showStatusBar = () => {
    AndroidSystembar.showStatusBar()
  }
  export const hideNavigationBar = () => {
    AndroidSystembar.hideNavigationBar()
  }
  export const showNavigationBar = () => {
    AndroidSystembar.showNavigationBar()
  }
  export const hideSystemBar = () => {
    AndroidSystembar.hideSystemBar()
  }
  export const showSystemBar = () => {
    AndroidSystembar.showSystemBar()
  }
}

namespace SystemBarIOS {
  export const setNavigationBarColor = (color: string) => {
    // console.warn('This module not support IOS')
  }
  export const animatedStatusBarColor = (
    color: string,
    duration: number = 200,
  ) => {
    // console.warn('This module not support IOS')
  }
  export const animatedNavigationBarColor = (
    color: string,
    duration: number = 200,
  ) => {
    // console.warn('This module not support IOS')
  }
  export const setIsDarkStatusBar = (isDark: boolean) => {
    // console.warn('This module not support IOS')
  }
  export const setIsDarkNavigationBar = (isDark: boolean) => {
    // console.warn('This module not support IOS')
  }
  export const animatedSystemBarColor = (
    color: string,
    duration: number = 200,
  ) => {
    // console.warn('This module not support IOS')
  }
  export const getNavigationBarColor = () => {
    // console.warn('This module not support IOS')
    return null
  }
  export const setStatusBarColor = (color: string) => {
    // console.warn('This module not support IOS')
  }
  export const getStatusBarColor = () => {
    // console.warn('This module not support IOS')
    return null
  }
  export const hideStatusBar = () => {
    // console.warn('This module not support IOS')
  }
  export const showStatusBar = () => {
    // console.warn('This module not support IOS')
  }
  export const hideNavigationBar = () => {
    // console.warn('This module not support IOS')
  }
  export const showNavigationBar = () => {
    // console.warn('This module not support IOS')
  }
  export const hideSystemBar = () => {
    // console.warn('This module not support IOS')
  }
  export const showSystemBar = () => {
    // console.warn('This module not support IOS')
  }
}

const SystemBar = Platform.select({
  android: SystemBarAndroid,
  default: SystemBarIOS,
})

export { SystemBar }
