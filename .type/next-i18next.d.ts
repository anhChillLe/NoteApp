import 'react-i18next'
import { TranslationKeys } from '../src/localization/en'

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: {
      translation: TranslationKeys
    }
  }
}
