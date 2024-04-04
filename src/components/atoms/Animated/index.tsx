import PagerView from 'react-native-pager-view'
import { Button, IconButton, Surface } from 'react-native-paper'
import Animated from 'react-native-reanimated'
import { withAnimated } from './utils'

const AnimatedSurface = withAnimated(Surface)
const AnimatedButton = withAnimated(Button)
const AnimatedIconButton = Animated.createAnimatedComponent(IconButton)

export const AnimatedPaper = {
  Surface: AnimatedSurface,
  Button: AnimatedButton,
  IconButton: AnimatedIconButton,
}

export const AnimatedPagerView = Animated.createAnimatedComponent(PagerView)
