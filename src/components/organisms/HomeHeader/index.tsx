import { FC, forwardRef, useEffect, useMemo } from 'react'
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import {
  IconButton,
  Text,
  TouchableRipple,
  TouchableRippleProps,
  useTheme,
} from 'react-native-paper'
import Animated, {
  AnimatedProps,
  Easing,
  LinearTransition,
  useAnimatedRef,
  useAnimatedStyle,
} from 'react-native-reanimated'
import { AnimatedInput, AnimatedPaper } from '~/components/Animated'
import { useLayout } from '~/hooks'

interface Props extends AnimatedProps<ViewProps> {
  isActiveSearch: boolean
  searchValue: string
  onSearchValueChange: (value: string) => void
  onSearchPress: () => void
  onCancelSearchPress: () => void
  onManagePress: () => void
  onSettingPress: () => void
}

const Header: FC<Props> = forwardRef<View, Props>(
  (
    {
      isActiveSearch,
      searchValue,
      onSearchValueChange,
      onSearchPress,
      onCancelSearchPress,
      onManagePress,
      onSettingPress,
      ...props
    },
    ref,
  ) => {
    const { colors, roundness } = useTheme()

    const input = useAnimatedRef<TextInput>()
    const [titleLayout, setTitleLayout] = useLayout()

    const transition = useMemo(() => {
      const duration = isActiveSearch ? 350 : 150
      const easing = Easing.out(Easing.cubic)
      return LinearTransition.duration(duration).easing(easing)
    }, [isActiveSearch])

    useEffect(() => {
      if (isActiveSearch) {
        input.current?.focus()
      } else {
        input.current?.blur()
      }
    }, [isActiveSearch, input.current])

    const titleStyle = useAnimatedStyle(() => {
      return {
        position: isActiveSearch ? 'absolute' : 'relative',
        left: isActiveSearch ? -(titleLayout?.width ?? 0) : 0,
        flex: isActiveSearch ? 0 : 1,
      }
    }, [isActiveSearch, titleLayout])

    const inputStyle = useAnimatedStyle(() => {
      return {
        flex: isActiveSearch ? 1 : 0,
      }
    }, [isActiveSearch])

    const searchStyle = useAnimatedStyle(() => {
      return {
        width: isActiveSearch ? '100%' : 52,
        borderRadius: roundness * 8,
      }
    }, [isActiveSearch, roundness])

    const searchBarStyle = useAnimatedStyle(() => {
      return {
        borderRadius: roundness * 8,
        backgroundColor: isActiveSearch
          ? colors.surfaceVariant
          : colors.background,
        flex: isActiveSearch ? 1 : 0,
      }
    }, [isActiveSearch, colors, roundness])

    const cancelButtonStyle = useAnimatedStyle(() => {
      return {
        // opacity: Number(isActiveSearch),
      }
    }, [isActiveSearch])

    const clearText = () => input.current?.clear()

    return (
      <Animated.View ref={ref} {...props}>
        <View style={styles.container}>
          <Animated.View layout={transition} style={titleStyle}>
            <Text
              variant="headlineMedium"
              style={styles.title}
              numberOfLines={1}
              onLayout={setTitleLayout}
            >
              Notes
            </Text>
          </Animated.View>

          <Animated.View
            style={[styles.search, searchStyle]}
            layout={transition}
          >
            <Animated.View
              style={[styles.search_bar, searchBarStyle]}
              layout={transition}
            >
              <AnimatedPaper.IconButton
                icon="search"
                onPress={onSearchPress}
                layout={transition}
              />
              <AnimatedInput
                ref={input}
                placeholder="Search"
                value={searchValue}
                onChangeText={onSearchValueChange}
                style={inputStyle}
                layout={transition}
              />
              <AnimatedPaper.IconButton
                icon="cross-small"
                layout={transition}
                onPress={clearText}
              />
            </Animated.View>

            <Animated.View style={cancelButtonStyle}>
              <TextButton title="Cancel" onPress={onCancelSearchPress} />
            </Animated.View>
          </Animated.View>

          <Animated.View layout={transition} style={styles.right}>
            <IconButton icon="folder" onPress={onManagePress} />
            <IconButton icon="menu-burger" onPress={onSettingPress} />
          </Animated.View>
        </View>
      </Animated.View>
    )
  },
)

// Fix ellipsizeMode problem of react native paper button
type BtnProps = Omit<TouchableRippleProps, 'children'> & {
  title: string
  style?: StyleProp<ViewStyle>
}
const TextButton: FC<BtnProps> = ({ style, title, ...props }) => {
  const { colors, roundness } = useTheme()

  return (
    <TouchableRipple
      style={[styles.cancel_button, { borderRadius: roundness * 8 }, style]}
      borderless
      {...props}
    >
      <Text
        variant="bodyMedium"
        style={{ color: colors.primary }}
        numberOfLines={1}
      >
        {title}
      </Text>
    </TouchableRipple>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  title: {
    fontWeight: '500',
  },
  cancel_button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  button: {
    margin: 0,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    gap: 4,
  },
  search_bar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    flexDirection: 'row',
  },
})

export default Header
