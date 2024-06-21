import React, { FC, ReactElement, useEffect, useMemo } from 'react'
import { useColorScheme } from 'react-native'
import { PaperProvider } from 'react-native-paper'
import { Settings } from 'react-native-paper/lib/typescript/core/settings'
import { AppTheme } from '~/styles/material3'
import { FlatIcon } from './FlatIcons'
import { SystemBar } from 'react-native-android-systembar'
import useSetting from '~/screens/Setting/store'
import { useAppColorScheme } from '~/hooks/theme'

interface Props {
  children: ReactElement
}

const useThemeData = () => {
  const themeIndex = useSetting(state => state.themeIndex)
  const colorScheme = useAppColorScheme()

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
  }, [theme.dark])

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
