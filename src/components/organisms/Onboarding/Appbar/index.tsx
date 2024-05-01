import { FC } from 'react'
import { StyleProp, StyleSheet, ViewProps, ViewStyle } from 'react-native'
import Animated, { AnimatedProps } from 'react-native-reanimated'
import { AnimatedPaper, Fill } from '~/components/atoms'

interface Props extends AnimatedProps<ViewProps> {
  backable?: boolean
  onBackPress: () => void
  skipable?: boolean
  onSkipPress: () => void
  backStyle?: StyleProp<ViewStyle>
  skipStyle?: StyleProp<ViewStyle>
}

export const OnboardingAppbar: FC<Props> = ({
  style,
  onBackPress,
  onSkipPress,
  backable,
  skipable,
  backStyle,
  skipStyle,
  ...props
}) => {
  return (
    <Animated.View style={[styles.container, style]} {...props}>
      <AnimatedPaper.IconButton
        icon="angle-small-left"
        onPress={onBackPress}
        disabled={!backable}
        style={backStyle}
      />
      <Fill />
      <AnimatedPaper.Button
        icon="angle-small-right"
        contentStyle={styles.btn_skip}
        onPress={onSkipPress}
        disabled={!skipable}
        style={skipStyle}
      >
        {strings.skip}
      </AnimatedPaper.Button>
    </Animated.View>
  )
}

const strings = {
  skip: 'Skip',
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  btn_skip: {
    flexDirection: 'row-reverse',
  },
})
