import { Platform, TextStyle } from 'react-native'
import { MD3Fonts } from '../ThemeProvider'

const ref = {
  typeface: {
    brandRegular: Platform.select({
      web: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
      ios: 'System',
      default: 'sans-serif',
    }),
    weightRegular: '400' as TextStyle['fontWeight'],

    plainMedium: Platform.select({
      web: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
      ios: 'System',
      default: 'sans-serif-medium',
    }),
    weightMedium: '500' as TextStyle['fontWeight'],
  },

  opacity: {
    level1: 0.08,
    level2: 0.12,
    level3: 0.16,
    level4: 0.38,
  },
}

const regularType = {
  fontFamily: ref.typeface.brandRegular,
  letterSpacing: 0,
  fontWeight: ref.typeface.weightRegular,
}

const mediumType = {
  fontFamily: ref.typeface.plainMedium,
  letterSpacing: 0.15,
  fontWeight: ref.typeface.weightMedium,
}

const typescale = {
  displayLarge: {
    ...regularType,
    lineHeight: 64,
    fontSize: 57,
  },
  displayMedium: {
    ...regularType,
    lineHeight: 52,
    fontSize: 45,
  },
  displaySmall: {
    ...regularType,
    lineHeight: 44,
    fontSize: 36,
  },

  headlineLarge: {
    ...regularType,
    lineHeight: 40,
    fontSize: 32,
  },
  headlineMedium: {
    ...regularType,
    lineHeight: 36,
    fontSize: 28,
  },
  headlineSmall: {
    ...regularType,
    lineHeight: 32,
    fontSize: 24,
  },

  titleLarge: {
    ...regularType,
    lineHeight: 28,
    fontSize: 22,
  },
  titleMedium: {
    ...mediumType,
    lineHeight: 24,
    fontSize: 16,
  },
  titleSmall: {
    ...mediumType,
    letterSpacing: 0.1,
    lineHeight: 20,
    fontSize: 14,
  },

  labelLarge: {
    ...mediumType,
    letterSpacing: 0.1,
    lineHeight: 20,
    fontSize: 14,
  },
  labelMedium: {
    ...mediumType,
    letterSpacing: 0.5,
    lineHeight: 16,
    fontSize: 12,
  },
  labelSmall: {
    ...mediumType,
    letterSpacing: 0.5,
    lineHeight: 16,
    fontSize: 11,
  },

  bodyLarge: {
    ...mediumType,
    fontWeight: ref.typeface.weightRegular,
    fontFamily: ref.typeface.brandRegular,
    lineHeight: 24,
    fontSize: 16,
  },
  bodyMedium: {
    ...mediumType,
    fontWeight: ref.typeface.weightRegular,
    fontFamily: ref.typeface.brandRegular,
    letterSpacing: 0.25,
    lineHeight: 20,
    fontSize: 14,
  },
  bodySmall: {
    ...mediumType,
    fontWeight: ref.typeface.weightRegular,
    fontFamily: ref.typeface.brandRegular,
    letterSpacing: 0.4,
    lineHeight: 16,
    fontSize: 12,
  },

  default: {
    ...regularType,
  },
}

type MD3FontsConfig = {
  fontFamily?: string
  fontWeight?: TextStyle['fontWeight']
}

function configureFonts(config: MD3FontsConfig): MD3Fonts {
  return Object.fromEntries(
    Object.entries(typescale).map(([variantName, variantProperties]) => [
      variantName,
      { ...variantProperties, ...config },
    ]),
  ) as MD3Fonts
}

export default configureFonts
