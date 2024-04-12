import PagerView from 'react-native-pager-view'
import {
  Button,
  Chip,
  Icon,
  IconButton,
  Surface,
  Text,
} from 'react-native-paper'
import Animated from 'react-native-reanimated'
import { withAnimated } from './utils'
import { Pressable } from 'react-native'

const AnimatedSurface = withAnimated(Surface)
const AnimatedButton = Animated.createAnimatedComponent(Button)
const AnimatedIconButton = Animated.createAnimatedComponent(IconButton)
const AnimatedChip = withAnimated(Chip)
const AnimatedText = withAnimated(Text)
const AnimatedIcon = withAnimated(Icon)

export const AnimatedPaper = {
  Surface: AnimatedSurface,
  Button: AnimatedButton,
  IconButton: AnimatedIconButton,
  Chip: AnimatedChip,
  Text: AnimatedText,
  Icon: AnimatedIcon,
}

export const AnimatedPagerView = Animated.createAnimatedComponent(PagerView)
export const AnimatedPressable = Animated.createAnimatedComponent(Pressable)
