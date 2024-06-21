import { MD3Theme } from 'react-native-paper'
import colorSchemes from './color'
import { ColorSchemes } from './color/utils'
import { NunitoFont } from './font/nunito'

export type Theme = {
  light: Partial<MD3Theme>
  dark: Partial<MD3Theme>
}

const base: Partial<MD3Theme> = {
  isV3: true,
  fonts: NunitoFont,
  version: 3,
  mode: 'adaptive',
  roundness: 4,
}

const createTheme = (schemes: ColorSchemes) => {
  return {
    light: {
      ...base,
      dark: false,
      colors: schemes.light,
    },
    dark: {
      ...base,
      dark: true,
      colors: schemes.dark,
    },
  }
}

const AppTheme = colorSchemes.map(createTheme)

export { AppTheme }
