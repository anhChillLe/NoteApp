import { Pressable } from 'react-native'
import PagerView from 'react-native-pager-view'
import {
  Appbar,
  Button,
  Chip,
  Divider,
  Icon,
  IconButton,
  Surface,
  Text,
  TouchableRipple,
} from 'react-native-paper'
import Animated from 'react-native-reanimated'
import { withAnimated } from './utils'

const AnimatedSurface = withAnimated(Surface)
const AnimatedButton = Animated.createAnimatedComponent(Button)
const AnimatedIconButton = Animated.createAnimatedComponent(IconButton)
const AnimatedChip = withAnimated(Chip)
const AnimatedText = withAnimated(Text)
const AnimatedIcon = withAnimated(Icon)
const AnimatedTouchableRipple =
  Animated.createAnimatedComponent(TouchableRipple)
const AnimatedDivider = withAnimated(Divider)
const AnimatedAppBar = withAnimated(Appbar)

export namespace AnimatedPaper {
  export const Surface = AnimatedSurface
  export const Button = AnimatedButton
  export const IconButton = AnimatedIconButton
  export const Chip = AnimatedChip
  export const Text = AnimatedText
  export const Icon = AnimatedIcon
  export const TouchableRipple = AnimatedTouchableRipple
  export const Divider = AnimatedDivider
  export const Appbar = AnimatedAppBar
}

export const AnimatedPagerView = Animated.createAnimatedComponent(PagerView)
export const AnimatedPressable = Animated.createAnimatedComponent(Pressable)
