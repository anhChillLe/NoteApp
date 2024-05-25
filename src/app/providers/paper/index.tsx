import React, { FC, ReactElement, useEffect, useMemo } from 'react'
import { useColorScheme } from 'react-native'
import { PaperProvider } from 'react-native-paper'
import { Settings } from 'react-native-paper/lib/typescript/core/settings'
import { useSetting } from '~/store/setting'
import { AppTheme } from '~/styles/material3'
import { FlatIcon } from './FlatIcons'
import { SystemBar } from 'react-native-android-systembar'

interface Props {
  children: ReactElement
}

const useThemeData = () => {
  const themeIndex = useSetting(state => state.themeIndex)
  const settingColorScheme = useSetting(state => state.colorScheme)
  const systemColorScheme = useColorScheme()
  const colorScheme =
    settingColorScheme === 'system'
      ? systemColorScheme ?? 'light'
      : settingColorScheme

  const theme = useMemo(
    () => AppTheme[themeIndex][colorScheme],
    [colorScheme, themeIndex, AppTheme],
  )

  return theme
}

const AppThemeProvider: FC<Props> = ({ children }) => {
  const theme = useThemeData()

  useEffect(() => {
    SystemBar.setIsDarkNavigationBar(!theme.dark)
    SystemBar.setIsDarkStatusBar(!theme.dark)
  }, [theme.dark, SystemBar])

  return (
    <PaperProvider settings={settings} theme={theme}>
      {children}
    </PaperProvider>
  )
}

const settings: Settings = {
  icon: FlatIcon,
  rippleEffectEnabled: true,
}

export default AppThemeProvider
