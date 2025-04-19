import { createContext, useContext } from 'react'
import { TextStyle } from 'react-native'

export enum MD3TypescaleKey {
  displayLarge = 'displayLarge',
  displayMedium = 'displayMedium',
  displaySmall = 'displaySmall',

  headlineLarge = 'headlineLarge',
  headlineMedium = 'headlineMedium',
  headlineSmall = 'headlineSmall',

  titleLarge = 'titleLarge',
  titleMedium = 'titleMedium',
  titleSmall = 'titleSmall',

  labelLarge = 'labelLarge',
  labelMedium = 'labelMedium',
  labelSmall = 'labelSmall',

  bodyLarge = 'bodyLarge',
  bodyMedium = 'bodyMedium',
  bodySmall = 'bodySmall',

  default = 'default',
}

type MD3Fonts = Record<MD3TypescaleKey, TextStyle>

type MD3Theme = {
  dark: boolean
  roundness: number
  colors: MD3Colors
  fonts: MD3Fonts
}

type MD3Colors = {
  primary: string
  surfaceTint: string
  onPrimary: string
  primaryContainer: string
  onPrimaryContainer: string
  secondary: string
  onSecondary: string
  secondaryContainer: string
  onSecondaryContainer: string
  tertiary: string
  onTertiary: string
  tertiaryContainer: string
  onTertiaryContainer: string
  error: string
  onError: string
  errorContainer: string
  onErrorContainer: string
  background: string
  onBackground: string
  surface: string
  onSurface: string
  surfaceVariant: string
  onSurfaceVariant: string
  outline: string
  outlineVariant: string
  shadow: string
  scrim: string
  inverseSurface: string
  inverseOnSurface: string
  inversePrimary: string
  primaryFixed: string
  onPrimaryFixed: string
  primaryFixedDim: string
  onPrimaryFixedVariant: string
  secondaryFixed: string
  onSecondaryFixed: string
  secondaryFixedDim: string
  onSecondaryFixedVariant: string
  tertiaryFixed: string
  onTertiaryFixed: string
  tertiaryFixedDim: string
  onTertiaryFixedVariant: string
  surfaceDim: string
  surfaceBright: string
  surfaceContainerLowest: string
  surfaceContainerLow: string
  surfaceContainer: string
  surfaceContainerHigh: string
  surfaceContainerHighest: string
  backdrop: string
}

const ThemeContext = createContext<MD3Theme>(null as never)

const ThemeProvider = ThemeContext.Provider

function useTheme() {
  return useContext(ThemeContext)
}

export { ThemeProvider, useTheme }
export type { MD3Colors, MD3Theme, MD3Fonts }
