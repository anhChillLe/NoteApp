import { MasonryFlashList } from '@shopify/flash-list'
import { Note } from 'note-app-database'
import { Pressable, TouchableOpacity } from 'react-native'
import {
  Button,
  Chip,
  Divider,
  Icon,
  IconButton,
  Shape,
  Text,
  TextInput,
  TouchableScale,
} from 'react-native-chill-ui'
import Animated from 'react-native-reanimated'

const AnimatedButton = Animated.createAnimatedComponent(Button)
const AnimatedIconButton = Animated.createAnimatedComponent(IconButton)
const AnimatedChip = Animated.createAnimatedComponent(Chip)
const AnimatedText = Animated.createAnimatedComponent(Text)
const AnimatedIcon = Animated.createAnimatedComponent(Icon)
const AnimatedDivider = Animated.createAnimatedComponent(Divider)
const AnimatedPressable = Animated.createAnimatedComponent(Pressable)
const AnimatedInput = Animated.createAnimatedComponent(TextInput)
const AnimatedTouchableScale = Animated.createAnimatedComponent(TouchableScale)
const AnimatedMasonryNoteList = Animated.createAnimatedComponent(
  MasonryFlashList<Note>,
)
const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity)
const AnimatedShape = Animated.createAnimatedComponent(Shape)

export {
  AnimatedButton,
  AnimatedChip,
  AnimatedDivider,
  AnimatedIcon,
  AnimatedIconButton,
  AnimatedInput,
  AnimatedMasonryNoteList,
  AnimatedPressable,
  AnimatedShape,
  AnimatedText,
  AnimatedTouchableOpacity,
  AnimatedTouchableScale,
}
