import { FC, memo, useEffect } from 'react'
import {
  LayoutRectangle,
  Platform,
  StyleSheet,
  TextInput,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native'
import { IconButton, Text, useTheme } from 'react-native-paper'
import Animated, {
  AnimatedProps,
  Easing,
  WithTimingConfig,
  ZoomIn,
  ZoomOut,
  interpolate,
  interpolateColor,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { AnimatedInput, AnimatedPaper } from '~/components/Animated'
import { useLayout } from '~/hooks'
import { useHomeSearch } from '~/store/home'
import { useHome } from '../Provider'

interface Props extends AnimatedProps<ViewProps> {}

export const HomeHeader: FC<Props> = ({ ...props }) => {
  const openSetting = useHome(state => state.openSetting)
  const openTagManager = useHome(state => state.openTagManager)

  const [buttonLayout, onButtonLayout] = useLayout()
  const [containerLayout, onContainerLayout] = useLayout()

  return (
    <Animated.View {...props}>
      <Animated.View onLayout={onContainerLayout}>
        <Animated.View style={styles.container}>
          <View>
            <Text variant="labelSmall">{new Date().toDateString()}</Text>
            <Text variant="titleLarge" style={styles.title}>
              {strings.appName}
            </Text>
          </View>
          <View style={styles.fill} />
          <Animated.View onLayout={onButtonLayout} style={styles.search_icon}>
            <AnimatedPaper.IconButton icon="search" />
          </Animated.View>
          <IconButton icon="folder" onPress={openTagManager} />
          <IconButton icon="menu-burger" onPress={openSetting} />
        </Animated.View>

        {containerLayout && buttonLayout && (
          <MemoSearchBar
            containerLayout={containerLayout}
            buttonLayout={buttonLayout}
          />
        )}
      </Animated.View>
    </Animated.View>
  )
}

interface SearchBarProps {
  containerLayout: LayoutRectangle
  buttonLayout: LayoutRectangle
}

const SearchBar: FC<SearchBarProps> = ({ buttonLayout, containerLayout }) => {
  const { colors, roundness } = useTheme()
  const { value, setValue, enalble, disable, isInSearchMode } = useHomeSearch()
  const input = useAnimatedRef<TextInput>()
  const progress = useSharedValue(0)

  useEffect(() => {
    if (isInSearchMode) {
      input.current?.focus()
      progress.value = withTiming(1, timingConfig)
    } else {
      input.current?.blur()
      progress.value = withTiming(0, timingConfig)
    }
  }, [isInSearchMode, progress])

  const searchContainerStyle = useAnimatedStyle<ViewStyle>(() => {
    return {
      backgroundColor: colors.background,
      left: interpolate(progress.value, [0, 1], [buttonLayout.x, 0]),
      width: interpolate(
        progress.value,
        [0, 1],
        [buttonLayout.width, containerLayout.width],
      ),
    }
  }, [buttonLayout, containerLayout, colors])

  const searchBarStyle = useAnimatedStyle<ViewStyle>(() => {
    return {
      borderRadius: roundness * 8,
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        ['transparent', colors.surfaceVariant],
      ),
    }
  }, [roundness, colors])

  const cancelButtonStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
    }
  }, [])

  const inputStyle = useAnimatedStyle(() => {
    return { opacity: progress.value }
  }, [])

  const clearValue = () => setValue('')

  return (
    <Animated.View style={[styles.search, searchContainerStyle]}>
      <Animated.View style={[styles.search_bar, searchBarStyle]}>
        <AnimatedPaper.IconButton icon="search" onPress={enalble} />
        <AnimatedInput
          ref={input}
          style={[styles.input, inputStyle]}
          placeholder="Search"
          value={value}
          onChangeText={setValue}
        />
        {!!value && (
          <AnimatedPaper.IconButton
            icon="cross-small"
            onPress={clearValue}
            exiting={ZoomOut}
            entering={ZoomIn}
          />
        )}
      </Animated.View>
      <AnimatedPaper.Button onPress={disable} style={cancelButtonStyle}>
        Cancel
      </AnimatedPaper.Button>
    </Animated.View>
  )
}

const MemoSearchBar = memo(SearchBar)

const strings = {
  appName: 'Chill note',
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    fontWeight: '500',
  },
  search_icon: {
    opacity: 0,
  },
  search: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    alignContent: 'stretch',
  },
  search_bar: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    zIndex: 1,
  },
  input: {
    flex: 1,
  },
  fill: {
    flex: 1,
  },
})
const duration = Platform.select({ android: 200, default: 350 })
const easing = Easing.out(Easing.cubic)
const timingConfig: WithTimingConfig = {
  duration,
  easing,
}
