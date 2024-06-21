import { DependencyList, useMemo } from 'react'
import { TextStyle, ViewStyle, useColorScheme } from 'react-native'
import { MD3Theme, useTheme } from 'react-native-paper'
import useSetting from '~/screens/Setting/store'

type ThemeCreator = (theme: MD3Theme) => ViewStyle | TextStyle

const useMemoThemeStyle = (
  creator: ThemeCreator,
  deps?: DependencyList,
): ViewStyle | TextStyle => {
  const theme = useTheme()
  return useMemo(() => {
    return creator(theme)
  }, [...(deps ?? []), theme])
}

const useAppColorScheme = () => {
  const settingColorScheme = useSetting(state => state.colorScheme)
  const systemColorScheme = useColorScheme()
  return settingColorScheme === 'system'
    ? systemColorScheme ?? 'light'
    : settingColorScheme
}

export default useMemoThemeStyle
export { useAppColorScheme }
