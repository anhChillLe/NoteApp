import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ColorSchemeName,
  Dimensions,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native'
import { Appbar, Divider, Menu, Section, Text } from 'react-native-chill-ui'
import Animated, {
  interpolate,
  measure,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AnimatedText } from '~/components'
import { useVisible } from '~/hooks'
import { languages } from '~/localization/i18n'
import { useSetting } from '~/app/providers/settings'
import { Haptick } from '~/services/haptick'
import { AppTheme } from '~/styles'
import ColorItem from './ColorItem'

interface Props {
  onBackPress: () => void
}

const SettingScreenLayout: FC<Props> = ({ onBackPress }) => {
  const { t } = useTranslation()
  const headerTitle = useAnimatedRef()
  const progress = useSharedValue(0)

  const handler = useAnimatedScrollHandler(event => {
    const distance = measure(headerTitle)?.height ?? 0
    const offset = event.contentOffset.y
    progress.value = interpolate(offset, [0, distance], [0, 1], 'clamp')
  })

  const appbarTitleStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
    }
  })

  const headerTitlerStyle = useAnimatedStyle(() => {
    return {
      opacity: 1 - progress.value,
    }
  })

  return (
    <SafeAreaView style={styles.container}>
      <Appbar>
        <Appbar.BackAction onPress={onBackPress} />
        <Appbar.Title children={t('setting')} style={appbarTitleStyle} />
      </Appbar>
      <Animated.ScrollView style={styles.scroll_container} onScroll={handler}>
        <Animated.View ref={headerTitle} style={styles.header}>
          <AnimatedText
            variant="displayMedium"
            style={[styles.header_title, headerTitlerStyle]}
            children={t('setting')}
          />
        </Animated.View>
        <Section title={t('theme')}>
          <ThemeSection />
          <ColorSchemeSection />
        </Section>
        <Divider />
        <Section title={t('list')}>
          <NumOfColumnsSection />
          <SortSection />
        </Section>
        <Divider />
        <Section title={t('language')}>
          <LanguageSection />
        </Section>
      </Animated.ScrollView>
    </SafeAreaView>
  )
}

const ThemeSection: FC = () => {
  const { t } = useTranslation()
  const { themeIndex, setThemeIndex: setTheme } = useSetting()
  const colorScheme = useColorScheme() ?? 'light'

  return (
    <Animated.View style={styles.theme_section_container}>
      <Text style={styles.theme_section_title} children={t('color')} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.theme_section_color_container}
      >
        {AppTheme.map((theme, index) => {
          const isSelected = index === themeIndex
          const onPress = () => {
            setTheme(index)
            Haptick.light()
          }
          return (
            <ColorItem
              key={index}
              colors={theme[colorScheme].colors}
              isSelected={isSelected}
              onPress={onPress}
              accessibilityLabel={`${t('theme')} ${index}`}
            />
          )
        })}
      </ScrollView>
    </Animated.View>
  )
}

const colorSchemeOptions: ColorSchemeName[] = ['light', 'dark']

const ColorSchemeSection: FC = () => {
  const { t } = useTranslation()
  const { colorScheme, setColorScheme } = useSetting()
  const section = useAnimatedRef<View>()
  const [visible, show, hide] = useVisible(false)

  return (
    <>
      <Section.Item
        title={t('color_scheme')}
        value={t('color_scheme_label', { colorScheme })}
        valueRef={section}
        onPress={show}
      />
      <Menu anchorRef={section} visible={visible} onRequestClose={hide}>
        {colorSchemeOptions.map(it => {
          const isSelected = it === colorScheme
          const onPress = () => setColorScheme(it)

          return (
            <Menu.SelectItem
              key={it}
              onPress={onPress}
              title={t('color_scheme_label', { colorScheme: it })}
              isSelected={isSelected}
            />
          )
        })}
        <Menu.SelectItem
          onPress={() => setColorScheme(null)}
          title={t('color_scheme_label')}
          isSelected={!colorScheme}
        />
      </Menu>
    </>
  )
}

const NumOfColumnsSection: FC = () => {
  const { t } = useTranslation()
  const section = useAnimatedRef<View>()
  const { numOfColumns, setNumOfColumn } = useSetting()
  const [visible, show, hide] = useVisible(false)

  const max = Math.round(Dimensions.get('screen').width / 200)
  const createLabel = (numOfColumns?: number | null) => {
    return !numOfColumns ? t('auto') : t('num_column', { count: numOfColumns })
  }

  const options = Array.from({ length: max }, (_, i) => 1 + i)

  return (
    <>
      <Section.Item
        title={t('list_type')}
        value={createLabel(numOfColumns)}
        valueRef={section}
        onPress={show}
      />
      <Menu anchorRef={section} visible={visible} onRequestClose={hide}>
        {options.map(it => {
          const isSelected = it === numOfColumns
          const onPress = () => {
            setNumOfColumn(it)
          }

          return (
            <Menu.SelectItem
              key={it}
              onPress={onPress}
              title={t('num_column', { count: it })}
              isSelected={isSelected}
            />
          )
        })}
        <Menu.SelectItem
          onPress={() => {
            setNumOfColumn(null)
          }}
          title={t('auto')}
          isSelected={numOfColumns === null}
        />
      </Menu>
    </>
  )
}

const SortSection: FC = () => {
  const { t } = useTranslation()
  const section = useAnimatedRef<View>()
  const { sortType, setSortType } = useSetting()
  const [visible, show, hide] = useVisible(false)

  const options = ['create', 'update'] as const

  return (
    <>
      <Section.Item
        title={t('sort')}
        value={t('sort_type_label', { value: sortType })}
        valueRef={section}
        onPress={show}
      />
      <Menu anchorRef={section} visible={visible} onRequestClose={hide}>
        {options.map(it => {
          const isSelected = it === sortType
          const onPress = () => setSortType(it)

          return (
            <Menu.SelectItem
              key={it}
              onPress={onPress}
              title={t('sort_type_label', { value: it })}
              isSelected={isSelected}
            />
          )
        })}
      </Menu>
    </>
  )
}

const LanguageSection: FC = () => {
  const { t } = useTranslation()
  const section = useAnimatedRef<View>()
  const { language, setLanguage } = useSetting()
  const [visible, show, hide] = useVisible(false)

  return (
    <>
      <Section.Item
        title={t('language')}
        value={t('language_label', { key: language })}
        valueRef={section}
        onPress={show}
      />
      <Menu anchorRef={section} visible={visible} onRequestClose={hide}>
        {languages.map(it => {
          const isSelected = it === language
          const onPress = () => setLanguage(it)

          return (
            <Menu.SelectItem
              key={it}
              onPress={onPress}
              title={t('language_label', { key: it })}
              isSelected={isSelected}
            />
          )
        })}
        <Menu.SelectItem
          onPress={() => setLanguage(null)}
          title={t('language_label')}
          isSelected={language === null}
        />
      </Menu>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  scroll_container: {
    flex: 1,
  },
  header_title: {
    fontWeight: '600',
  },
  section_container: {
    gap: 8,
  },
  list_section_title: {
    padding: 16,
    opacity: 0.75,
  },
  sheet: {
    marginHorizontal: 16,
    marginBottom: 32,
    padding: 8,
  },
  theme_section_title: {
    fontSize: 20,
    fontWeight: '500',
  },
  theme_section_container: {
    padding: 16,
    gap: 8,
  },
  theme_section_color_container: {
    gap: 8,
  },
})

export default SettingScreenLayout
