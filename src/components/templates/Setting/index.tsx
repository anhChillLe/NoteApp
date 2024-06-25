import { FC, memo } from 'react'
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native'
import { List, Text, TouchableRipple, useTheme } from 'react-native-paper'
import Animated, {
  ZoomIn,
  ZoomOut,
  interpolate,
  measure,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AnimatedPaper } from '~/components/Animated'
import { Menu } from '~/components/atoms'
import { MenuSelectItem, Section } from '~/components/molecules'
import { Appbar } from '~/components/organisms'
import { useVisible } from '~/hooks'
import { useAppColorScheme } from '~/hooks/theme'
import useSetting, { ColorScheme } from '~/screens/Setting/store'
import { AppTheme } from '~/styles/material3'

interface Props {
  onBackPress: () => void
}

const SettingScreenLayout: FC<Props> = ({ onBackPress }) => {
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
      <Appbar
        onBackPress={onBackPress}
        title="Setting"
        titleStyle={appbarTitleStyle}
      />
      <Animated.ScrollView
        style={styles.scroll_container}
        contentContainerStyle={{ alignItems: 'stretch' }}
        onScroll={handler}
      >
        <Animated.View ref={headerTitle} style={styles.header}>
          <AnimatedPaper.Text
            variant="displayMedium"
            style={[styles.header_title, headerTitlerStyle]}
          >
            Setting
          </AnimatedPaper.Text>
        </Animated.View>

        <List.Section title="Theme">
          <ThemeSection />
          <ColorSchemeSection />
          <NumOfColumnsSection />
        </List.Section>
      </Animated.ScrollView>
    </SafeAreaView>
  )
}

const ThemeSection: FC = () => {
  const themeIndex = useSetting(state => state.themeIndex)
  const setTheme = useSetting(state => state.setThemeIndex)
  const colorScheme = useAppColorScheme()

  return (
    <Animated.View style={{ padding: 16, gap: 8 }}>
      <Text variant="titleMedium">Color</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        {AppTheme.map((theme, index) => {
          const isSlected = index === themeIndex
          const onPress = () => setTheme(index)
          return (
            <TouchableRipple
              key={index}
              theme={theme[colorScheme]}
              onPress={onPress}
              borderless
              style={{
                width: 48,
                aspectRatio: 1,
                backgroundColor: theme[colorScheme].colors.primary,
                borderRadius: 24,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isSlected ? (
                <AnimatedPaper.Icon
                  entering={ZoomIn.duration(150)}
                  exiting={ZoomOut.duration(150)}
                  source="check"
                  size={24}
                  color={theme[colorScheme].colors.onPrimary}
                />
              ) : (
                <View />
              )}
            </TouchableRipple>
          )
        })}
      </ScrollView>
    </Animated.View>
  )
}

const ColorSchemeSection: FC = () => {
  const { roundness } = useTheme()
  const colorScheme = useSetting(state => state.colorScheme)
  const setColorScheme = useSetting(state => state.setColorScheme)
  const section = useAnimatedRef<View>()
  const [visible, show, hide] = useVisible(false)

  const label: Record<ColorScheme, string> = {
    light: 'Light',
    dark: 'Dark',
    system: 'Follow system',
  }

  const options: ColorScheme[] = ['light', 'dark', 'system']

  return (
    <>
      <Section
        title="Color scheme"
        value={label[colorScheme]}
        valueRef={section}
        onPress={show}
      />
      <Menu
        anchorRef={section}
        visible={visible}
        onRequestClose={hide}
        style={{ borderRadius: roundness * 3, overflow: 'hidden' }}
      >
        {options.map(it => {
          const isSelected = it === colorScheme
          const onPress = () => {
            setColorScheme(it)
            hide()
          }

          return (
            <MenuSelectItem
              key={it}
              onPress={onPress}
              title={label[it]}
              isSelected={isSelected}
            />
          )
        })}
      </Menu>
    </>
  )
}

const NumOfColumnsSection: FC = () => {
  const { roundness } = useTheme()
  const numOfColumns = useSetting(state => state.numOfColumns)
  const setNumOfColumn = useSetting(state => state.setNumOfColumn)

  const section = useAnimatedRef<View>()
  const [visible, show, hide] = useVisible(false)

  const max = Math.round(Dimensions.get('screen').width / 200)
  const options = Array.from({ length: max }, (_, i) => i + 1)

  const createLabel = (numOfColumns: number | 'auto') => {
    return numOfColumns === 'auto'
      ? 'Auto'
      : numOfColumns.toString() + ' columns'
  }

  return (
    <>
      <Section
        title="Columns of note"
        value={createLabel(numOfColumns)}
        valueRef={section}
        onPress={show}
      />
      <Menu
        anchorRef={section}
        visible={visible}
        onRequestClose={hide}
        style={{ borderRadius: roundness * 3, overflow: 'hidden' }}
      >
        {options.map(it => {
          const isSelected = it === numOfColumns
          const onPress = () => {
            setNumOfColumn(it)
            hide()
          }

          return (
            <MenuSelectItem
              key={it}
              onPress={onPress}
              title={createLabel(it)}
              isSelected={isSelected}
            />
          )
        })}
        <MenuSelectItem
          onPress={() => {
            setNumOfColumn('auto')
            hide()
          }}
          title="Auto"
          isSelected={numOfColumns === 'auto'}
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
  section_title: {},

  sheet: {
    marginHorizontal: 16,
    marginBottom: 32,
    padding: 8,
  },
})

export default memo(SettingScreenLayout)
