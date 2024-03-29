import { configureFonts } from 'react-native-paper'
import { MD3Type } from 'react-native-paper/lib/typescript/types'

const config: Partial<MD3Type> = {
  fontFamily: 'Nunito',
}
export const NunitoFont = configureFonts({ config, isV3: true })
