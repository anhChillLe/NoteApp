import { MD3Colors } from 'react-native-paper/lib/typescript/types'
import Color from 'color'

export interface ColorSchemes {
  light: MD3Colors
  lightHighContrast: MD3Colors
  lightMediumContrast: MD3Colors
  dark: MD3Colors
  darkHighContrast: MD3Colors
  darkMediumContrast: MD3Colors
}

export function getColorSchemes(jsonTheme: JsonTheme): ColorSchemes {
  const getColors = (key: keyof Schemes) => {
    const scheme = jsonTheme.schemes[key]
    return createMD3Color(scheme, jsonTheme.palettes)
  }

  const light = getColors('light')
  const lightMediumContrast = getColors('light-medium-contrast')
  const lightHighContrast = getColors('light-high-contrast')
  const dark = getColors('dark')
  const darkMediumContrast = getColors('dark-medium-contrast')
  const darkHighContrast = getColors('dark-high-contrast')

  return {
    light,
    lightHighContrast,
    lightMediumContrast,
    dark,
    darkHighContrast,
    darkMediumContrast,
  }
}

export function createMD3Color(
  scheme: ColorScheme,
  palettes: Palettes,
): MD3Colors {
  return {
    ...scheme,
    surfaceDisabled: Color(palettes.neutral[90])
      .alpha(opacity.level2)
      .rgb()
      .string(),
    onSurfaceDisabled: Color(palettes.neutral[90])
      .alpha(opacity.level4)
      .rgb()
      .string(),
    backdrop: Color(palettes['neutral-variant'][20]).alpha(0.4).rgb().string(),
    elevation: {
      level0: 'transparent',
      level1: convertToSolidColor(scheme.primary, scheme.background, 0.05),
      level2: convertToSolidColor(scheme.primary, scheme.background, 0.08),
      level3: convertToSolidColor(scheme.primary, scheme.background, 0.11),
      level4: convertToSolidColor(scheme.primary, scheme.background, 0.12),
      level5: convertToSolidColor(scheme.primary, scheme.background, 0.14),
    },
  }
}

const opacity = {
  level1: 0.08,
  level2: 0.12,
  level3: 0.16,
  level4: 0.38,
}

function hexToRgb(hex: string) {
  let r: number, g: number, b: number
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16)
    g = parseInt(hex[2] + hex[2], 16)
    b = parseInt(hex[3] + hex[3], 16)
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16)
    g = parseInt(hex.substring(3, 5), 16)
    b = parseInt(hex.substring(5, 7), 16)
  } else {
    throw new Error('Input string is not a hexcolor')
  }
  return { r, g, b }
}

export function convertToSolidColor(
  primary: string,
  background: string,
  alpha: number,
) {
  const { r: inputR, g: inputG, b: inputB } = hexToRgb(primary)
  const {
    r: backgroundR,
    g: backgroundG,
    b: backgroundB,
  } = hexToRgb(background)

  const newR = Math.round(inputR * alpha + backgroundR * (1 - alpha))
  const newG = Math.round(inputG * alpha + backgroundG * (1 - alpha))
  const newB = Math.round(inputB * alpha + backgroundB * (1 - alpha))

  return `rgb(${newR}, ${newG}, ${newB})`
}

export function toHex(color: string): string {
  return Color(color).hex()
}
