import { useFocusEffect } from '@react-navigation/native'
import React, { FC } from 'react'
import { BackHandler, StyleSheet, View } from 'react-native'
import {
  FadeInDown,
  FadeInUp,
  FadeOutDown,
  FadeOutUp,
} from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Home } from '~/components/organisms'
import { useHomeSearch, useHomeSelect } from '~/store/home'

type Props = {}

export const HomeScreenLayout: FC<Props> = () => {
  const isInSelectMode = useHomeSelect(state => state.isInSelectMode)
  const disableSelectMode = useHomeSelect(state => state.disable)
  const isInSearchMode = useHomeSearch(state => state.isInSearchMode)
  const disableSearchMode = useHomeSearch(state => state.disable)

  useFocusEffect(() => {
    const handler = () => {
      isInSearchMode && disableSearchMode()
      isInSelectMode && disableSelectMode()
      return isInSelectMode || isInSearchMode
    }
    const listener = BackHandler.addEventListener('hardwareBackPress', handler)
    return listener.remove
  })

  return (
    <Home.DragingTagProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
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

          <Home.ContentList
            style={styles.list}
            contentContainerStyle={styles.list_content}
            bounces={true}
          />

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
  },
  empty: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  list_content: {
    paddingHorizontal: 16,
    flexGrow: 1,
  },
  taglist_container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
})
