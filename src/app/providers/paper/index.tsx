import React, { FC, ReactElement, useEffect, useMemo } from 'react'
import { useColorScheme } from 'react-native'
import { PaperProvider } from 'react-native-paper'
import { Settings } from 'react-native-paper/lib/typescript/core/settings'
import { SystemBarController } from '~/modules'
import { yellowTheme } from '~/styles/material3'
import { FlatIcon } from './FlatIcons'

interface Props {
  children: ReactElement
}

const AppThemeProvider: FC<Props> = ({ children }) => {
  const colorScheme = useColorScheme() ?? 'light'
  const theme = useMemo(() => yellowTheme[colorScheme], [colorScheme])

  useEffect(() => {
    const color = theme.colors?.background
    if (color) {
      SystemBarController.setNavigationBarColor(color)
      SystemBarController.setStatusBarColor(color)
    }
  }, [theme])

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
