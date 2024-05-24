import { FC } from 'react'
import { ScrollView, StyleSheet, View, useColorScheme } from 'react-native'
import { Icon, List, Text, TouchableRipple, useTheme } from 'react-native-paper'
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
import { Appbar } from '~/components/organisms'
import { useVisible } from '~/hooks'
import { useSetting } from '~/store/setting'
import { AppTheme } from '~/styles/material3'

interface Props {
  onBackPress: () => void
}

export const SettingLayout: FC<Props> = ({ onBackPress }) => {
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
        </List.Section>
      </Animated.ScrollView>
    </SafeAreaView>
  )
}

const ThemeSection: FC = () => {
  const themeIndex = useSetting(state => state.themeIndex)
  const setTheme = useSetting(state => state.setTheme)
  const systemColorScheme = useColorScheme() ?? 'light'
  const appClorScheme = useSetting(state => state.colorScheme)
  const colorScheme =
    appClorScheme === 'system' ? systemColorScheme : appClorScheme

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
  const { colors, roundness } = useTheme()
  const colorScheme = useSetting(state => state.colorScheme)
  const setColorScheme = useSetting(state => state.setColorScheme)
  const section = useAnimatedRef<View>()

  const [visible, show, hide] = useVisible(false)

  const label: Record<'light' | 'dark' | 'system', string> = {
    light: 'Light',
    dark: 'Dark',
    system: 'Follow system',
  }

  return (
    <>
      <TouchableRipple onPress={show}>
        <Animated.View
          style={{
            padding: 16,
            gap: 8,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Text variant="titleMedium">Color scheme</Text>
          <Animated.View
            ref={section}
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              gap: 4,
              opacity: 0.75,
            }}
          >
            <Text variant="bodyMedium">{label[colorScheme]}</Text>
            <Icon source="angle-small-right" size={24} />
          </Animated.View>
        </Animated.View>
      </TouchableRipple>
      <Menu
        anchorRef={section}
        visible={visible}
        onDismiss={hide}
        onRequestClose={hide}
        style={{ borderRadius: roundness * 3, overflow: 'hidden' }}
      >
        {['light' as 'light', 'dark' as 'dark', 'system' as 'system'].map(
          it => {
            const isSelected = it === colorScheme
            const onPress = () => {
              setColorScheme(it)
              hide()
            }
            return (
              <TouchableRipple key={it} onPress={onPress}>
                <View
                  style={{
                    flexDirection: 'row',
                    padding: 16,
                    gap: 32,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: isSelected
                      ? colors.primaryContainer
                      : colors.background,
                  }}
                >
                  <Text
                    variant="bodyMedium"
                    style={{ color: colors.onPrimaryContainer }}
                  >
                    {label[it]}
                  </Text>
                  <Animated.View style={{ opacity: isSelected ? 1 : 0 }}>
                    <Icon
                      source="check"
                      size={20}
                      color={colors.onPrimaryContainer}
                    />
                  </Animated.View>
                </View>
              </TouchableRipple>
            )
          },
        )}
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
