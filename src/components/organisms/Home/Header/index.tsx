import { FC, useEffect } from 'react'
import { StyleSheet, TextInput, ViewProps, ViewStyle } from 'react-native'
import { IconButton, Text, useTheme } from 'react-native-paper'
import Animated, {
  AnimatedProps,
  Easing,
  Extrapolation,
  WithTimingConfig,
  ZoomIn,
  ZoomOut,
  dispatchCommand,
  interpolate,
  interpolateColor,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { AnimatedInput, AnimatedPaper } from '~/components/Animated'
import { Column, Fill } from '~/components/atoms'
import { useLayout } from '~/hooks'
import { useHomeSearch } from '~/store/home'
import { useHome } from '../Provider'

interface Props extends AnimatedProps<ViewProps> {}

export const HomeHeader: FC<Props> = ({ style, ...props }) => {
  const { colors, roundness } = useTheme()
  const openSetting = useHome(state => state.openSetting)
  const openTagManager = useHome(state => state.openTagManager)
  const { value, setValue, enalble, disable, isInSearchMode } = useHomeSearch()

  const [searchButtonLayout, onSearchButtonLayout] = useLayout()
  const [containerLayout, onContainerLayout] = useLayout()
  const [cancelButtonLayout, onCancelButtonLayout] = useLayout()
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

  const searchStyle = useAnimatedStyle<ViewStyle>(() => {
    if (!searchButtonLayout || !containerLayout || !cancelButtonLayout)
      return {}
    const currentLeft = searchButtonLayout.x
    const tartgetLeft = 0
    const currentWidth = searchButtonLayout.width
    const targetWidth = containerLayout.width

    return {
      left: interpolate(progress.value, [0, 1], [currentLeft, tartgetLeft]),
      width: interpolate(progress.value, [0, 1], [currentWidth, targetWidth]),
    }
  }, [
    searchButtonLayout,
    containerLayout,
    cancelButtonLayout,
    roundness,
    colors,
  ])

  const searchBackgroundStyle = useAnimatedStyle(() => {
    const currentColor = 'transparent'
    const tartgetColor = colors.surfaceVariant
    return {
      right: interpolate(
        progress.value,
        [0, 1],
        [0, (cancelButtonLayout?.width ?? 0) + 4],
      ),
      borderRadius: roundness * 10,
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [currentColor, tartgetColor],
      ),
    }
  })

  const containerStyle = useAnimatedStyle(() => {
    return { opacity: interpolate(progress.value, [0, 1], [1, 0]) }
  })

  const cancelButtonStyle = useAnimatedStyle(() => {
    return {
      marginStart: 4,
      opacity: interpolate(progress.value, [0, 1], [0, 1], Extrapolation.CLAMP),
    }
  })

  const inputStyle = useAnimatedStyle(() => {
    return { opacity: progress.value }
  })

  return (
    <Animated.View style={style} {...props}>
      <Animated.View onLayout={onContainerLayout}>
        <Animated.View style={[styles.container, containerStyle]}>
          <Column>
            <Text variant="labelSmall">{new Date().toDateString()}</Text>
            <Text variant="titleLarge" style={styles.title}>
              {strings.appName}
            </Text>
          </Column>
          <Fill />
          <Animated.View
            onLayout={onSearchButtonLayout}
            style={styles.search_icon}
          >
            <AnimatedPaper.IconButton icon="search" />
          </Animated.View>
          <IconButton icon="folder" onPress={openTagManager} />
          <IconButton icon="menu-burger" onPress={openSetting} />
        </Animated.View>

        <Animated.View style={[styles.search, searchStyle]}>
          <Animated.View
            style={[StyleSheet.absoluteFill, searchBackgroundStyle]}
          />
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
              onPress={() => setValue('')}
              exiting={ZoomOut}
              entering={ZoomIn}
            />
          )}
          <AnimatedPaper.Button
            children="Cancel"
            onLayout={onCancelButtonLayout}
            style={cancelButtonStyle}
            onPress={disable}
          />
        </Animated.View>
      </Animated.View>
    </Animated.View>
  )
}

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
  button: {
    margin: 0,
  },
  search_icon: {
    opacity: 0,
  },
  search_container: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    alignItems: 'center',
  },
  search: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  input: {
    flex: 1,
  },
})
const duration = 350
const easing = Easing.out(Easing.cubic)
const timingConfig: WithTimingConfig = {
  duration,
  easing,
}
