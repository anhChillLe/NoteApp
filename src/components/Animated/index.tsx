import { KeyboardAvoidingView, Pressable } from 'react-native'
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
import { Input, TouchableScale } from '../atoms'
import { withAnimated } from './utils'
import { FlashList, MasonryFlashList } from '@shopify/flash-list'
import { Note } from '~/services/database/model'
import { MasonryList } from '../molecules'

const toAnimated = Animated.createAnimatedComponent

const AnimatedSurface = withAnimated(Surface)
const AnimatedButton = toAnimated(Button)
const AnimatedIconButton = toAnimated(IconButton)
const AnimatedChip = withAnimated(Chip)
const AnimatedText = withAnimated(Text)
const AnimatedIcon = withAnimated(Icon)
const AnimatedTouchableRipple = toAnimated(TouchableRipple)
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

export const AnimatedPagerView = toAnimated(PagerView)
export const AnimatedPressable = toAnimated(Pressable)
export const AnimatedInput = toAnimated(Input)
export const AnimatedTouchableScale = toAnimated(TouchableScale)
export const AnimatedKeyboardAvoidingView = toAnimated(KeyboardAvoidingView)
export const AnimatedMasonryNoteList = toAnimated(MasonryList<Note>)
export const AnimatedNoteList = toAnimated(FlashList<Note>)
