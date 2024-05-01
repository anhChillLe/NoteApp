import React, { FC, useState } from 'react'
import { NativeSyntheticEvent, SafeAreaView, StyleSheet } from 'react-native'
import PagerView from 'react-native-pager-view'
import { Button } from 'react-native-paper'
import {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import { StorySet } from '~/assets/storyset'
import { AnimatedPagerView } from '~/components/atoms'
import { PagerIndicator } from '~/components/molecules'
import { Onboarding } from '~/components/organisms'
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

export const OnboardingLayout: FC<Props> = ({ onSkip, onStart }) => {
  const pager = useAnimatedRef<PagerView>()
  const [position, setPosition] = useState(0)

  const onPageSelected = (e: PageSelectEvent) => {
    setPosition(e.nativeEvent.position)
  }

  const isLast = position === 2
  const isFirst = position === 0

  const handlePrevious = () => {
    pager.current?.setPage(position - 1)
  }

  const handleNext = () => {
    pager.current?.setPage(position + 1)
  }

  const progress = useSharedValue(0)

  const handler = useAnimatedPagerScrollHandler({
    onPageScroll: (e: PageScrollEvent) => {
      'worklet'
      progress.value = e.offset + e.position
    },
  })

  const backIconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 1]),
  }))

  const skipIconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [1, 2], [1, 0]),
  }))

  return (
    <SafeAreaView style={styles.container}>
      <Onboarding.Appbar
        onBackPress={handlePrevious}
        onSkipPress={onSkip}
        backStyle={backIconStyle}
        backable={!isFirst}
        skipable={!isLast}
        skipStyle={skipIconStyle}
      />
      <AnimatedPagerView
        ref={pager}
        style={[styles.container]}
        onPageSelected={onPageSelected}
        onPageScroll={handler}
      >
        <Onboarding.Page
          Icon={StorySet.Note}
          title={strings.welcome.title}
          description={strings.welcome.description}
          style={styles.page}
        />
        <Onboarding.Page
          Icon={StorySet.Notification}
          title={strings.noti.title}
          description={strings.noti.description}
          style={styles.page}
        />
        <Onboarding.Page
          Icon={StorySet.Sync}
          title={strings.sync.title}
          description={strings.sync.description}
          style={styles.page}
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
      <Button
        mode="contained"
        onPress={isLast ? onStart : handleNext}
        style={styles.action}
        contentStyle={styles.action_content}
      >
        {isLast ? strings.start : strings.next}
      </Button>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 24,
  },
  container: {
    flex: 1,
  },
  indicator: {
    paddingVertical: 32,
  },
  action: {
    marginHorizontal: 24,
    marginBottom: 16,
  },
  action_content: {
    padding: 6,
  },
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
