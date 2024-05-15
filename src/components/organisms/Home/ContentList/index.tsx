import React, { FC, useEffect, useMemo, useState } from 'react'
import { ListRenderItem, Platform, StyleSheet } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { trigger } from 'react-native-haptic-feedback'
import Animated, {
  Easing,
  LinearTransition,
  cancelAnimation,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useLayout } from '~/hooks'
import { Note } from '~/services/database/model'
import { useHomeSelect } from '~/store/home'
import { useDragingHome } from '../DargingTagProvider'
import { useHome } from '../Provider'
import { AnimatedCell } from './AnimatedCell'
import { HomeEmpty } from './Empty'
import { DetectTagNoteListItem } from './Item'
import { PrivateActive } from './PrivateActive'

type AnimatedFlatListProps<T> = React.ComponentProps<
  typeof Animated.FlatList<T>
>

type ListProps = Omit<AnimatedFlatListProps<Note>, 'renderItem' | 'data'>

type RenderItem = ListRenderItem<Note>

interface Props extends ListProps {
  space?: number
}

const keyExtractor = (item: Note, index: number) => item.id

const beginActiveOffset = 50
const submitActiveOffset = 200

export const HomeContentList: FC<Props> = ({
  space = 8,
  style,
  contentContainerStyle,
  ...props
}) => {
  const { dragingTag } = useDragingHome()
  const notes = useHome(state => state.notes)
  const openEditor = useHome(state => state.openEditor)
  const openPrivateNote = useHome(state => state.openPrivateNote)
  const changeTaskItemStatus = useHome(state => state.changeTaskItemStatus)
  const addTagToNote = useHome(state => state.addTagToNote)
  const isInSelectMode = useHomeSelect(state => state.isInSelectMode)
  const selecteds = useHomeSelect(state => state.selecteds)
  const select = useHomeSelect(state => state.select)

  const extraData = useMemo(() => [], [dragingTag, selecteds])

  const [layout, onlayout] = useLayout()

  const renderItem: RenderItem = ({ item }) => {
    const onPress = () => {
      if (isInSelectMode) select(item)
      else openEditor(item)
    }

    const onLongPress = () => {
      trigger('effectTick')
      select(item)
    }

    const onDragIn = () => {
      dragingTag && addTagToNote(item, dragingTag)
    }

    const isSelected = selecteds.some(it => it.id === item.id)

    return (
      <DetectTagNoteListItem
        data={item}
        isSelected={isSelected}
        selectable={isInSelectMode}
        maxLineOfContent={6}
        maxLineOfTitle={1}
        onPress={onPress}
        onLongPress={onLongPress}
        onTaskItemPress={changeTaskItemStatus}
        onDragIn={onDragIn}
      />
    )
  }

  const { gesutre, overScrollY, handler } = useOverScroll(
    layout?.height ?? 0,
    openPrivateNote,
  )

  const listStyle = useAnimatedStyle(() => {
    if (Platform.OS === 'ios') return {}
    const translateY = overScrollY.value
    return {
      transform: [{ translateY }],
    }
  })

  return (
    <GestureDetector gesture={gesutre}>
      <Animated.View style={[styles.container, style]} onLayout={onlayout}>
        <PrivateActive
          offset={overScrollY}
          beginActiveOffset={beginActiveOffset}
          submitActiveOffset={submitActiveOffset}
          style={styles.private}
        />

        <Animated.FlatList
          data={notes}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          extraData={extraData}
          style={[styles.list, listStyle]}
          contentContainerStyle={[{ gap: space }, contentContainerStyle]}
          ListEmptyComponent={ListEmptyComponent}
          CellRendererComponent={AnimatedCell}
          itemLayoutAnimation={LinearTransition}
          onScroll={handler}
          overScrollMode="never"
          {...props}
        />
      </Animated.View>
    </GestureDetector>
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  list: {
    flex: 1,
  },
  private: {
    zIndex: 1,
  },
  empty: {
    flex: 1,
  },
})

const ListEmptyComponent: FC = () => <HomeEmpty style={styles.empty} />

const useOverScroll = (height: number, onSubmit: () => void) => {
  const [activePan, setActivePan] = useState(false)
  const [activable, setActivable] = useState(false)
  const scrollY = useSharedValue(0)

  const handler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y
    },
    onEndDrag: event => {
      if (activable) {
        runOnJS(onSubmit)()
      }
    },
  })

  useAnimatedReaction(
    () => scrollY.value,
    value => {
      runOnJS(setActivePan)(value <= 0)
    },
  )

  const gesutre = Gesture.Pan()
    .enabled(activePan && Platform.OS === 'android')
    .activeOffsetY(0)
    .onStart(e => {
      cancelAnimation(scrollY)
    })
    .onUpdate(e => {
      const progress = e.translationY / height // [0, 1]
      scrollY.value = -height * (progress - 0.35 * progress)
    })
    .onEnd(e => {
      if (activable) {
        runOnJS(onSubmit)()
      }
      scrollY.value = withTiming(0, {
        duration: 200,
        easing: Easing.out(Easing.cubic),
      })
    })

  const overScrollY = useDerivedValue(() => {
    return interpolate(-scrollY.value, [height, 0], [height, 0], 'clamp')
  })

  useAnimatedReaction(
    () => overScrollY.value,
    value => {
      runOnJS(setActivable)(value >= submitActiveOffset)
    },
    [setActivable],
  )

  useEffect(() => {
    activable && runOnJS(trigger)('effectTick')
  }, [activable])

  return {
    gesutre,
    handler,
    overScrollY,
  }
}
