// i18n.ts
import {
  Locale,
  formatDistanceToNow,
  formatDuration,
  intervalToDuration,
} from 'date-fns'
import { enUS, vi } from 'date-fns/locale'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { findBestLanguageTag } from 'react-native-localize'
import { storage } from '~/services/storage'
import ns_en from './en'
import ns_vi from './vi'

const resources = {
  en: {
    translation: ns_en,
  },
  vi: {
    translation: ns_vi,
  },
}

export const languages = Object.keys(resources)

const getStorageLanguage = (): string | null => {
  const settingStr = storage.getString('settings')
  if (settingStr == null) {
    return null
  }
  const settings = JSON.parse(settingStr)
  return settings.language
}

const detectLanguage = (callback: (lang: string) => void) => {
  const settingLanguage = getStorageLanguage()
  if (settingLanguage != null) {
    callback(settingLanguage)
    return
  }
  const bestLanguage = findBestLanguageTag(languages)
  callback(bestLanguage?.languageTag ?? 'en')
}

const languageDetector = {
  type: 'languageDetector' as 'languageDetector',
  async: true,
  detect: detectLanguage,
  init: () => {},
  cacheUserLanguage: () => {},
}

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    resources,
    ns: ['translation'],
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false,
    },
  })

const locales: Record<string, Locale> = {
  en: enUS,
  vi: vi,
}

// I don't know why but build-in relativetime format not working, so i override it
i18n.services.formatter?.add('relativetime', (value, lng, options) => {
  const date = new Date(value)
  return formatDistanceToNow(date, {
    addSuffix: false,
    locale: locales[lng as string] ?? enUS,
    includeSeconds: false,
    ...options,
  })
})

// Duration by milliseconds
i18n.services.formatter?.add('duration', (value, lng, options) => {
  const number = Number(value)
  const duration = intervalToDuration({ start: 0, end: number })
  const str = formatDuration(duration, {
    locale: locales[lng as string] ?? enUS,
    ...options,
  })
  return str
})

i18n.services.formatter?.add('map', (value, lng, options) => {
  return options[value] ?? options.default ?? 'Unknown'
})

export default i18n
