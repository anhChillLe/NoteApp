import { MD3Colors, MD3Theme, configureFonts } from 'react-native-chill-ui'
import json_themes from '~/assets/theme'

const createMD3ColorFromScheme = (source: RawScheme): MD3Colors => {
  return {
    ...source,
    backdrop: `${source.inverseSurface}32`,
  }
}

const createTheme = (scheme: RawScheme, fontFamily?: string): MD3Theme => {
  return {
    colors: createMD3ColorFromScheme(scheme),
    dark: false,
    fonts: configureFonts({ fontFamily }),
    roundness: 4,
  }
}

const AppTheme = json_themes.map(({ schemes }) => ({
  light: createTheme(schemes.light),
  dark: createTheme(schemes.dark),
}))

export { AppTheme }
