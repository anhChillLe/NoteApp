import { MD3Theme } from 'react-native-paper'
import { NunitoFont } from './font/nunito'
import {
  greenColors,
  yellowColors,
  redColors,
  blueColors,
  violetColors,
} from './color'

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

const yellowTheme: Theme = {
  light: {
    ...base,
    dark: false,
    colors: yellowColors.light,
  },
  dark: {
    ...base,
    dark: true,
    colors: yellowColors.dark,
  },
}

const greenTheme: Theme = {
  light: {
    ...base,
    dark: false,
    colors: greenColors.light,
  },
  dark: {
    ...base,
    dark: true,
    colors: greenColors.dark,
  },
}

const blueTheme: Theme = {
  light: {
    ...base,
    dark: false,
    colors: blueColors.light,
  },
  dark: {
    ...base,
    dark: true,
    colors: blueColors.dark,
  },
}
const violetTheme: Theme = {
  light: {
    ...base,
    dark: false,
    colors: violetColors.light,
  },
  dark: {
    ...base,
    dark: true,
    colors: violetColors.dark,
  },
}

const redTheme: Theme = {
  light: {
    ...base,
    dark: false,
    colors: redColors.light,
  },
  dark: {
    ...base,
    dark: true,
    colors: redColors.dark,
  },
}

export { yellowTheme, greenTheme, blueTheme, redTheme, violetTheme }
