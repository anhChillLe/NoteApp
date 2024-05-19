import { useFocusEffect } from '@react-navigation/native'
import React, { FC, useCallback, useState } from 'react'
import { BackHandler, StyleSheet, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { Button } from 'react-native-paper'
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
  FadeOutDown,
  FadeOutUp,
  WithTimingConfig,
  cancelAnimation,
  clamp,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Home } from '~/components/organisms'
import { PrivateActive } from '~/components/organisms/Home/ContentList/PrivateActive'
import { useHome } from '~/components/organisms/Home/Provider'
import { useLayout } from '~/hooks'
import { useHomeSearch, useHomeSelect } from '~/store/home'

export const HomeScreenLayout: FC = () => {
  const isInSelectMode = useHomeSelect(state => state.isInSelectMode)
  const isInSearchMode = useHomeSearch(state => state.isInSearchMode)
  const openPrivateNote = useHome(state => state.openPrivateNote)
  useHomeBackHandler()

  const [activePan, setActivePan] = useState(false)
  const scrollY = useSharedValue(0)

  const handler = useAnimatedScrollHandler(
    event => {
      const offsetY = event.contentOffset.y
      scrollY.value = offsetY
      runOnJS(setActivePan)(offsetY <= 0)
    },
    [setActivePan],
  )

  const gesture = Gesture.Pan()
    .enabled(activePan)
    .activeOffsetY(0)
    .onStart(e => {
      cancelAnimation(scrollY)
    })
    .onUpdate(e => {
      scrollY.value = -e.translationY * 0.5
    })
    .onEnd(e => {
      if (scrollY.value <= -150) {
        runOnJS(openPrivateNote)()
      }
    })
    .onFinalize(() => {
      scrollY.value = withTiming(0, timingConfig)
    })

  const listStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: clamp(-scrollY.value, 0, 1000) }],
  }))

  return (
    <Home.DragingTagProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.content_container}>
          {isInSelectMode ? (
            <Home.SelectionAppbar
              style={styles.header}
              entering={FadeInUp.duration(200)}
              exiting={FadeOutUp.duration(200)}
            />
          ) : (
            <Home.Header
              style={styles.header}
              entering={FadeInUp.duration(200)}
              exiting={FadeOutUp.duration(200)}
            />
          )}
          <Home.TagList contentContainerStyle={styles.taglist_container} />

          <GestureDetector gesture={gesture}>
            <Animated.View style={styles.list_container}>
              <PrivateActive offset={scrollY} activeRange={[50, 150]} />
              <Home.ContentList
                style={[styles.list, listStyle]}
                contentContainerStyle={[styles.list_content]}
                onScroll={handler}
              />
            </Animated.View>
          </GestureDetector>

          {!isInSearchMode &&
            (isInSelectMode ? (
              <Home.Actionbar
                entering={FadeInDown.duration(200)}
                exiting={FadeOutDown.duration(200)}
              />
            ) : (
              <Home.BottomAppbar
                entering={FadeInDown.duration(200)}
                exiting={FadeOutDown.duration(200)}
              />
            ))}
        </View>
      </SafeAreaView>
    </Home.DragingTagProvider>
  )
}

const useHomeBackHandler = () => {
  const isInSelectMode = useHomeSelect(state => state.isInSelectMode)
  const disableSelectMode = useHomeSelect(state => state.disable)
  const isInSearchMode = useHomeSearch(state => state.isInSearchMode)
  const disableSearchMode = useHomeSearch(state => state.disable)

  const handler = useCallback(() => {
    isInSearchMode && disableSearchMode()
    isInSelectMode && disableSelectMode()
    return isInSelectMode || isInSearchMode
  }, [isInSearchMode, isInSelectMode, disableSearchMode, disableSelectMode])

  useFocusEffect(() => {
    const listener = BackHandler.addEventListener('hardwareBackPress', handler)
    return listener.remove
  })
}

const timingConfig: WithTimingConfig = {
  duration: 200,
  easing: Easing.out(Easing.cubic),
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content_container: {
    flex: 1,
    gap: 8,
  },
  header: {
    paddingHorizontal: 16,
  },
  empty: {
    flex: 1,
  },
  list_container: {
    flex: 1,
    overflow: 'hidden',
  },
  list: {
    flex: 1,
  },
  list_content: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 8,
  },
  taglist_container: {
    paddingHorizontal: 16,
  },
})
