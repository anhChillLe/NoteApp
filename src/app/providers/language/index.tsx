import i18next from 'i18next'
import { FC, PropsWithChildren, useEffect } from 'react'
import { findBestLanguageTag } from 'react-native-localize'
import { languages } from '~/localization/i18n'
import { useSetting } from '~/app/providers/settings'

const LanguageProvider: FC<PropsWithChildren> = ({ children }) => {
  const { language } = useSetting()
  useEffect(() => {
    if (language) {
      i18next.changeLanguage(language)
    } else {
      const lng = findBestLanguageTag(languages)
      i18next.changeLanguage(lng?.languageTag)
    }
  }, [language])

  return children
}

export default LanguageProvider
