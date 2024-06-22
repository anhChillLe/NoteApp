import { NavigationContainer, Theme } from '@react-navigation/native'
import { FC, PropsWithChildren } from 'react'
import { MD3Theme, useTheme } from 'react-native-paper'
import BootSplash from 'react-native-bootsplash'

const AppNavigationContainer: FC<PropsWithChildren> = ({ children }) => {
  const paperTheme = useTheme()
  const navTheme = themeConverter(paperTheme)
  return (
    <NavigationContainer
      theme={navTheme}
      children={children}
      onReady={() => BootSplash.hide({ fade: true })}
    />
  )
}

const themeConverter = ({ dark, colors }: MD3Theme): Theme => {
  return {
    dark,
    colors: {
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.onBackground,
      border: colors.outline,
      notification: colors.error,
    },
  }
}

export default AppNavigationContainer
