import { FC } from 'react'
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  ViewStyle,
} from 'react-native'
import { useTheme } from 'react-native-paper'
import Animated, {
  AnimatedStyle,
  SharedTransition,
} from 'react-native-reanimated'
import { AnimatedPaper } from '~/components/atoms'

interface Props extends TextInputProps {
  containerStyle?: AnimatedStyle<StyleProp<ViewStyle>>
  mode: 'compact' | 'full'
  onIconPress?: () => void
}

const SearchBar: FC<Props> = ({
  containerStyle,
  style,
  mode,
  onIconPress,
  ...props
}) => {
  const { roundness, colors, fonts } = useTheme()

  const isCompact = mode === 'compact'

  return (
    <Animated.View
      style={[
        styles.container,
        {
          borderRadius: roundness * 10,
          backgroundColor: colors.surfaceVariant,
        },
        containerStyle,
      ]}
      sharedTransitionTag="search-container"
    >
      <AnimatedPaper.IconButton
        icon="search"
        rippleColor="transparent"
        sharedTransitionTag="search"
        onPress={onIconPress}
      />
      <TextInput
        style={[
          styles.input,
          {
            color: colors.onSurfaceVariant,
            fontFamily: fonts.default.fontFamily,
            display: isCompact ? 'none' : 'flex',
            flex: 1,
          },
          style,
        ]}
        selectionColor={colors.primary}
        {...props}
      />
    </Animated.View>
  )
}

export { SearchBar }

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    overflow: 'hidden',
  },
  input: {},
})
