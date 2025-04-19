import { FC, Ref, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, TextInput, View, ViewProps } from 'react-native'
import { Button, IconButton, Text, useTheme } from 'react-native-chill-ui'
import Animated, {
  AnimatedProps,
  Easing,
  FadeIn,
  FadeOut,
  LinearTransition,
  useAnimatedRef,
  useAnimatedStyle,
} from 'react-native-reanimated'
import { AnimatedIconButton, AnimatedInput } from '~/components'
import { useLayout } from '~/hooks'

interface Props extends AnimatedProps<ViewProps> {
  ref?: Ref<View>
  isActiveSearch: boolean
  searchValue: string
  onSearchValueChange: (value: string) => void
  onSearchPress: () => void
  onCancelSearchPress: () => void
  onManagePress: () => void
  onSettingPress: () => void
}

const HomeHeader: FC<Props> = ({
  ref,
  isActiveSearch,
  searchValue,
  onSearchValueChange,
  onSearchPress,
  onCancelSearchPress,
  onManagePress,
  onSettingPress,
  ...props
}) => {
  const { t } = useTranslation()
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
  }, [isActiveSearch, input])

  const titleStyle = useAnimatedStyle(() => {
    return {
      position: isActiveSearch ? 'absolute' : 'relative',
      left: isActiveSearch ? -(titleLayout?.width ?? 0) : 0,
      flex: isActiveSearch ? 0 : 1,
    }
  }, [isActiveSearch, titleLayout])

  const inputStyle = useAnimatedStyle(() => {
    return {
      fontSize: 16,
      flex: isActiveSearch ? 1 : 0,
    }
  }, [isActiveSearch])

  const searchStyle = useAnimatedStyle(() => {
    return {
      width: isActiveSearch ? '100%' : 48,
      borderRadius: roundness * 8,
    }
  }, [isActiveSearch, roundness])

  const searchBarStyle = useAnimatedStyle(() => {
    return {
      borderRadius: roundness * 8,
      backgroundColor: isActiveSearch
        ? colors.surfaceContainer
        : colors.background,
      flex: isActiveSearch ? 1 : 0,
    }
  }, [isActiveSearch, colors, roundness])

  const clearText = () => onSearchValueChange('')

  return (
    <Animated.View ref={ref} {...props}>
      <View style={styles.container}>
        <Animated.View layout={transition} style={titleStyle}>
          <Text
            variant="headlineMedium"
            style={styles.title}
            numberOfLines={1}
            onLayout={setTitleLayout}
            children={t('app_name')}
          />
        </Animated.View>

        <Animated.View style={[styles.search, searchStyle]} layout={transition}>
          <Animated.View
            style={[styles.search_bar, searchBarStyle]}
            layout={transition}
          >
            <AnimatedIconButton
              icon="search-outline"
              accessibilityLabel={t('search')}
              onPress={onSearchPress}
              layout={transition}
              style={styles.icon}
            />
            <AnimatedInput
              ref={input}
              placeholder={t('search')}
              value={searchValue}
              onChangeText={onSearchValueChange}
              style={inputStyle}
              layout={transition}
              autoCorrect={false}
              autoCapitalize="none"
            />
            {!!searchValue && (
              <AnimatedIconButton
                icon="close-outline"
                accessibilityLabel={t('clear')}
                layout={transition}
                onPress={clearText}
                entering={FadeIn.duration(100)}
                exiting={FadeOut.duration(100)}
                style={styles.icon}
              />
            )}
          </Animated.View>

          <Button
            size="small"
            onPress={onCancelSearchPress}
            title={t('cancel')}
          />
        </Animated.View>

        <Animated.View layout={transition} style={styles.right}>
          <IconButton
            icon="folder-outline"
            onPress={onManagePress}
            accessibilityLabel={t('tag_manager')}
            style={styles.icon}
          />
          <IconButton
            icon="menu-outline"
            onPress={onSettingPress}
            accessibilityLabel={t('setting')}
            style={styles.icon}
          />
        </Animated.View>
      </View>
    </Animated.View>
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
  icon: {
    margin: 2,
  },
})

export default HomeHeader
