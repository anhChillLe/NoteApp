import React, { FC, memo, useState } from 'react'
import {
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'
import { PagerViewInternal } from 'react-native-pager-view/lib/typescript/PagerView'
import { Button, Text } from 'react-native-paper'
import {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SvgProps } from 'react-native-svg'
import { StorySet } from '~/assets/storyset'
import { AnimatedPagerView, AnimatedPaper } from '~/components/Animated'
import { LargeButton } from '~/components/atoms'
import { PagerIndicator } from '~/components/molecules'
import { useAnimatedPagerScrollHandler } from '~/hooks'

interface Props {
  onStart: () => void
  onSkip: () => void
}

type PageSelectEvent = NativeSyntheticEvent<Readonly<{ position: number }>>

type PageScrollEvent = {
  eventName: string
  offset: number
  position: number
}

const OnboardingScreenLayout: FC<Props> = ({ onSkip, onStart }) => {
  const pager = useAnimatedRef<PagerViewInternal>()
  const [position, setPosition] = useState(0)

  const onPageSelected = (e: PageSelectEvent) => {
    setPosition(e.nativeEvent.position)
  }

  const progress = useSharedValue(0)

  const handler = useAnimatedPagerScrollHandler(
    {
      onPageScroll: (e: PageScrollEvent) => {
        'worklet'
        progress.value = e.offset + e.position
      },
    },
    [],
  )

  const backIconStyle = useAnimatedStyle(
    () => ({
      opacity: interpolate(progress.value, [0, 1], [0, 1], 'clamp'),
    }),
    [],
  )

  const skipIconStyle = useAnimatedStyle(
    () => ({
      opacity: interpolate(progress.value, [1, 2], [1, 0], 'clamp'),
    }),
    [],
  )

  const isLast = position === 2
  const isFirst = position === 0

  const previous = () => {
    pager.current?.setPage(position - 1)
  }

  const next = () => {
    pager.current?.setPage(position + 1)
  }

  return (
    <SafeAreaView style={styles.container}>
      <Appbar
        onBackPress={previous}
        onSkipPress={onSkip}
        backStyle={backIconStyle}
        backable={!isFirst}
        skipable={!isLast}
        skipStyle={skipIconStyle}
      />
      <AnimatedPagerView
        ref={pager}
        style={styles.pager_container}
        onPageSelected={onPageSelected}
        onPageScroll={handler}
        useNext={false}
      >
        <Page
          Icon={StorySet.Note}
          title={strings.welcome.title}
          description={strings.welcome.description}
        />
        <Page
          Icon={StorySet.Notification}
          title={strings.noti.title}
          description={strings.noti.description}
        />
        <Page
          Icon={StorySet.Sync}
          title={strings.sync.title}
          description={strings.sync.description}
        />
      </AnimatedPagerView>
      <PagerIndicator
        count={3}
        current={progress}
        variant="morse"
        scale={4}
        size={8}
        space={8}
        style={styles.indicator}
      />
      <LargeButton
        mode="contained"
        onPress={isLast ? onStart : next}
        style={styles.action}
        children={isLast ? strings.start : strings.next}
      />
    </SafeAreaView>
  )
}

interface AppbarProps {
  backable?: boolean
  onBackPress: () => void
  skipable?: boolean
  onSkipPress: () => void
  backStyle?: StyleProp<ViewStyle>
  skipStyle?: StyleProp<ViewStyle>
}

const Appbar: FC<AppbarProps> = ({
  onBackPress,
  onSkipPress,
  backable,
  skipable,
  backStyle,
  skipStyle,
}) => {
  return (
    <View style={styles.appbar}>
      <AnimatedPaper.IconButton
        icon="angle-small-left"
        onPress={onBackPress}
        disabled={!backable}
        style={backStyle}
      />
      <View style={styles.fill} />
      <AnimatedPaper.Button
        icon="angle-small-right"
        contentStyle={styles.btn_skip}
        onPress={onSkipPress}
        disabled={!skipable}
        style={skipStyle}
      >
        {strings.skip}
      </AnimatedPaper.Button>
    </View>
  )
}

interface PageProps {
  Icon: FC<SvgProps>
  title: string
  description: string
}

const Page: FC<PageProps> = ({ Icon, title, description }) => {
  return (
    <View style={styles.page}>
      <View style={styles.icon_container}>
        <Icon style={styles.icon} />
      </View>
      <View style={styles.content_container}>
        <Text variant="headlineMedium" style={styles.title}>
          {title}
        </Text>
        <Text variant="bodyLarge" style={styles.desc}>
          {description}
        </Text>
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
    paddingHorizontal: 4,
  },
  btn_skip: {
    flexDirection: 'row-reverse',
  },
  fill: {
    flex: 1,
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

const strings = {
  welcome: {
    title: 'Welcome to ChillNote',
    description:
      'Explore ChillNote, your new digital haven for thoughts and reminders. Enjoy the simplicity and joy of note-taking redefined.',
  },
  noti: {
    title: 'Stay Updated with Notifications',

    description:
      'Never miss a critical update or reminder with our timely notifications. Keep your productivity on track effortlessly.',
  },
  sync: {
    title: 'Sync Your Notes Across Devices',
    description:
      'Elevate your note-taking experience with cross-device synchronization. Access your notes anywhere, keeping them safe and updated.',
  },
  start: 'Get start',
  next: 'Next',
  skip: 'Skip',
}

export default memo(OnboardingScreenLayout)
