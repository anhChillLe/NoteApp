import { FC, ReactElement, useEffect, useMemo } from 'react'
import { Appearance, useColorScheme } from 'react-native'
import { ThemeProvider } from 'react-native-chill-ui'
import { useSetting } from '~/app/providers/settings'
import { AppTheme } from '~/styles'

interface Props {
  children: ReactElement
}

const useThemeData = () => {
  const { themeIndex } = useSetting()
  const colorScheme = useColorScheme() ?? 'light'
  const theme = useMemo(
    () => AppTheme[themeIndex]?.[colorScheme] ?? AppTheme[0],
    [colorScheme, themeIndex],
  )

  return theme
}

const AppThemeProvider: FC<Props> = ({ children }) => {
  const theme = useThemeData()
  const { colorScheme } = useSetting()
  useEffect(() => {
    Appearance.setColorScheme(colorScheme)
  }, [colorScheme])

  return <ThemeProvider value={theme} children={children} />
}

export default AppThemeProvider
