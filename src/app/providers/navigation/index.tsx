import { NavigationContainer, Theme } from '@react-navigation/native'
import { FC, ReactElement } from 'react'
import { MD3Theme, useTheme } from 'react-native-paper'

interface Props {
  children: ReactElement
}

const AppNavigationContainer: FC<Props> = ({ children }) => {
  const paperTheme = useTheme()
  const navTheme = themeConverter(paperTheme)
  return <NavigationContainer theme={navTheme}>{children}</NavigationContainer>
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
