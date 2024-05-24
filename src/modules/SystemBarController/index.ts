import Color from 'color'
import { useState, useEffect } from 'react'
import { NativeModules, Platform } from 'react-native'
const SystemBarController: SystemBarControllerType =
  NativeModules.SystemBarController

type SystemBarControllerType = {
  setNavigationBarColor: (color: string) => Promise<void>
  animatedNavigationBarColor: (color: string, duration: number) => Promise<void>
  animatedStatusBarColor: (color: string, duration: number) => Promise<void>
  animatedSystemBarColor: (color: string, duration: number) => Promise<void>
  getNavigationBarColor: () => string | null
  setStatusBarColor: (color: string) => Promise<void>
  setSystemBarColor: (color: string) => Promise<void>
  setIsAppearanceLightStatusBars: (isLight: boolean) => Promise<void>
  setIsAppearanceLightNavigationBars: (isLight: boolean) => Promise<void>
  getStatusBarColor: () => string | null
  hideStatusBar: () => void
  showStatusBar: () => void
  hideNavigationBar: () => void
  showNavigationBar: () => void
  hideSystemBar: () => void
  showSystemBar: () => void
}

namespace SystemBarAndroid {
  function toHex(color: string): string {
    return Color(color).hex()
  }

  export const setNavigationBarColor = (color: string) => {
    SystemBarController.setNavigationBarColor(toHex(color))
  }
  export const animatedStatusBarColor = (
    color: string,
    duration: number = 200,
  ) => {
    SystemBarController.animatedStatusBarColor(toHex(color), duration)
  }
  export const setIsDarkStatusBar = (isLight: boolean) => {
    SystemBarController.setIsAppearanceLightStatusBars(isLight)
  }
  export const setIsDarkNavigationBar = (isLight: boolean) => {
    SystemBarController.setIsAppearanceLightNavigationBars(isLight)
  }
  export const animatedNavigationBarColor = (
    color: string,
    duration: number = 200,
  ) => {
    SystemBarController.animatedNavigationBarColor(toHex(color), duration)
  }
  export const animatedSystemBarColor = (
    color: string,
    duration: number = 200,
  ) => {
    SystemBarController.animatedSystemBarColor(toHex(color), duration)
  }
  export const getNavigationBarColor = () => {
    return SystemBarController.getNavigationBarColor()
  }
  export const setStatusBarColor = (color: string) => {
    SystemBarController.setStatusBarColor(toHex(color))
  }
  export const getStatusBarColor = () => {
    return SystemBarController.getStatusBarColor()
  }
  export const hideStatusBar = () => {
    SystemBarController.hideStatusBar()
  }
  export const showStatusBar = () => {
    SystemBarController.showStatusBar()
  }
  export const hideNavigationBar = () => {
    SystemBarController.hideNavigationBar()
  }
  export const showNavigationBar = () => {
    SystemBarController.showNavigationBar()
  }
  export const hideSystemBar = () => {
    SystemBarController.hideSystemBar()
  }
  export const showSystemBar = () => {
    SystemBarController.showSystemBar()
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

export default SystemBar
