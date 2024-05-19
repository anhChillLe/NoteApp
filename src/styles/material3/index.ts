import { MD3Theme } from 'react-native-paper'
import {
  blueColors,
  greenColors,
  redColors,
  violetColors,
  yellowColors,
} from './color'
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

const yellowTheme = createTheme(yellowColors)

const greenTheme = createTheme(greenColors)

const blueTheme = createTheme(blueColors)

const violetTheme = createTheme(violetColors)

const redTheme = createTheme(redColors)

const AppTheme = {
  yellow: yellowTheme,
  green: greenTheme,
  blue: blueTheme,
  red: redTheme,
  violet: violetTheme,
}

export { AppTheme }
