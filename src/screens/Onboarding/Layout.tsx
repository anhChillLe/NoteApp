import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { Button, PagerIndicator, Text } from 'react-native-chill-ui'
import Animated, {
  interpolate,
  runOnJS,
  SharedValue,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SvgProps } from 'react-native-svg'
import { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils'
import { StorySet } from '~/assets/storyset'
import { AnimatedButton } from '~/components'
import { useLayout } from '~/hooks'

interface Props {
  onStart: () => void
  onSkip: () => void
}

const OnboardingScreenLayout: FC<Props> = ({ onSkip, onStart }) => {
  const { t } = useTranslation()
  const [isLast, setIsLast] = useState(false)
  const [layout, onLayout] = useLayout()
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>()
  const progress = useSharedValue(0)

  const handler = useAnimatedScrollHandler(
    {
      onScroll: e => {
        'worklet'
        if (layout?.width) {
          progress.value = e.contentOffset.x / layout.width
        }
      },
      onMomentumEnd: e => {
        'worklet'
        if (layout?.width) {
          runOnJS(setIsLast)(
            e.contentOffset.x + layout.width === e.contentSize.width,
          )
        }
      },
    },
    [layout, setIsLast],
  )

  const previous = () => {
    if (layout) {
      const scrollOffset = (progress.value - 1) * layout.width
      scrollViewRef.current?.scrollTo({ x: scrollOffset, y: 0 })
    }
  }

  const next = () => {
    if (layout) {
      const scrollOffset = (progress.value + 1) * layout.width
      scrollViewRef.current?.scrollTo({ x: scrollOffset, y: 0 })
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Appbar onBackPress={previous} onSkipPress={onSkip} progress={progress} />
      <Animated.ScrollView
        ref={scrollViewRef}
        pagingEnabled
        horizontal
        onLayout={onLayout}
        onScroll={handler}
        showsHorizontalScrollIndicator={false}
      >
        <Page
          Icon={StorySet.Note}
          title={t('onboarding.welcome.title')}
          description={t('onboarding.welcome.description')}
          style={{ width: layout?.width }}
        />
        <Page
          Icon={StorySet.Notification}
          title={t('onboarding.noti.title')}
          description={t('onboarding.noti.description')}
          style={{ width: layout?.width }}
        />
      </Animated.ScrollView>
      <PagerIndicator
        count={2}
        current={progress}
        variant="morse"
        scale={4}
        size={8}
        space={8}
        style={styles.indicator}
      />
      <Button
        mode="contained"
        size="large"
        onPress={isLast ? onStart : next}
        style={styles.action}
        title={t(isLast ? 'get_start' : 'next')}
      />
    </SafeAreaView>
  )
}

interface AppbarProps {
  onBackPress: () => void
  onSkipPress: () => void
  progress: SharedValue<number>
}

const Appbar: FC<AppbarProps> = ({ onBackPress, onSkipPress, progress }) => {
  const { t } = useTranslation()
  const backButtonStyle = useAnimatedStyle(
    () => ({
      opacity: interpolate(progress.value, [0, 1], [0, 1], 'clamp'),
    }),
    [],
  )

  const skipButtonStyle = useAnimatedStyle(
    () => ({
      opacity: interpolate(progress.value, [0, 1], [1, 0], 'clamp'),
    }),
    [],
  )

  return (
    <View style={styles.appbar}>
      <AnimatedButton
        key="back"
        onPress={onBackPress}
        style={backButtonStyle}
        accessibilityLabel={t('go_back')}
        icon="chevron-back-outline"
      />
      <AnimatedButton
        key="skip"
        onPress={onSkipPress}
        style={skipButtonStyle}
        accessibilityLabel={t('skip')}
      >
        <Button.Text children={t('skip')} />
        <Button.Icon name="chevron-forward-outline" />
      </AnimatedButton>
    </View>
  )
}

interface PageProps extends ViewProps {
  Icon: FC<SvgProps>
  title: string
  description: string
}

const Page: FC<PageProps> = ({ Icon, title, description, style, ...props }) => {
  return (
    <View style={[styles.page, style]} {...props}>
      <View style={styles.icon_container}>
        <Icon style={styles.icon} />
      </View>
      <View style={styles.content_container}>
        <Text variant="headlineMedium" style={styles.title} children={title} />
        <Text variant="bodyLarge" style={styles.desc} children={description} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 24,
    flex: 1,
    alignItems: 'stretch',
  },
  container: {
    flex: 1,
  },
  pager_container: {
    flex: 1,
  },
  indicator: {
    paddingVertical: 32,
  },
  action: {
    marginHorizontal: 24,
    marginBottom: 16,
  },
  appbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    aspectRatio: 1,
    width: '100%',
  },
  content_container: {
    gap: 8,
  },
  title: {
    fontWeight: 'bold',
  },
  desc: {},
})

export default OnboardingScreenLayout
