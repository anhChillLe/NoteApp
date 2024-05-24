import jsonColors from './json'
import { getColorSchemes } from './utils'

const colorSchemes = jsonColors.map(getColorSchemes)

export default colorSchemes
