import { MD3Theme } from 'react-native-paper'
import { NunitoFont } from './font/nunito'
import { greenColors, yellowColors } from './color'

type Theme = {
  light: Partial<MD3Theme>
  dark: Partial<MD3Theme>
}

const base: Partial<MD3Theme> = {
  isV3: true,
  fonts: NunitoFont,
}

const yellowTheme: Theme = {
  light: {
    ...base,
    colors: yellowColors.light,
  },
  dark: {
    ...base,
    colors: yellowColors.dark,
  },
}

const greenTheme: Theme = {
  light: {
    ...base,
    colors: greenColors.light,
  },
  dark: {
    ...base,
    colors: greenColors.dark,
  },
}

export { yellowTheme, greenTheme }
