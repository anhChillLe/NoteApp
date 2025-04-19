import {
  Children,
  FC,
  ReactElement,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
} from 'react'
import {
  LayoutChangeEvent,
  LayoutRectangle,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native'
import Animated, {
  AnimatedProps,
  AnimatedRef,
  Easing,
  MeasuredDimensions,
  measure,
  runOnUI,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '../../../styles/ThemeProvider'
import { Icon, IconName, Portal, Shape, Text } from '../../atoms'
import Modal, { ModalProps } from '../../atoms/Modal'

interface MenuProps extends ModalProps {
  anchorRef: AnimatedRef<any>
  animationDuration?: number
  safeArea?: boolean
}

type MenuType = FC<MenuProps> & {
  Item: FC<ItemProps>
  SelectItem: FC<MenuSelectItemProps>
}
const AnimatedShape = Animated.createAnimatedComponent(Shape)
const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity)
const Menu: MenuType = ({
  anchorRef,
  animationDuration = 180,
  safeArea = true,
  children,
  visible,
  style,
  onRequestClose,
  ...props
}) => {
  const progress = useSharedValue(0)

  const windowDimensions = useWindowDimensions()
  const anchorMeasurement = useSharedValue<MeasuredDimensions | null>(null)
  const contentLayout = useSharedValue<LayoutRectangle | undefined>(undefined)
  const insets = useSafeAreaInsets()

  const show = useCallback(() => {
    runOnUI(() => (anchorMeasurement.value = measure(anchorRef)))()
    progress.value = withTiming(1, { duration: animationDuration, easing })
  }, [anchorMeasurement, anchorRef, animationDuration, progress])

  const hide = useCallback(() => {
    progress.value = withTiming(0, { duration: animationDuration, easing })
  }, [animationDuration, progress])

  useEffect(() => {
    if (visible) show()
    else hide()
  }, [visible, show, hide])

  const onContentLayout = (e: LayoutChangeEvent) => {
    // eslint-disable-next-line react-compiler/react-compiler
    contentLayout.value = e.nativeEvent.layout
  }

  const contentStyle = useAnimatedStyle<ViewStyle>(() => {
    return {
      ...getPosition(
        anchorMeasurement.value,
        windowDimensions,
        contentLayout.value,
        safeArea ? insets : undefined,
      ),
      transform: [{ scale: progress.value }],
      opacity: progress.value,
    }
  }, [windowDimensions, contentLayout])

  return (
    <Portal>
      <Modal
        visible={visible}
        dismissable
        dismissableBackButton
        onRequestClose={onRequestClose}
        lazy={false}
        {...props}
      >
        <AnimatedShape
          onLayout={onContentLayout}
          style={[styles.content_container, contentStyle, style]}
        >
          {Children.toArray(children).map(child => {
            if (!isValidElement(child)) return null

            if (child.type === (MenuSelectItem || MenuItem)) {
              return cloneElement(
                child as ReactElement<TouchableOpacityProps>,
                {
                  onPress: e => {
                    ;(
                      child as ReactElement<TouchableOpacityProps>
                    ).props.onPress?.(e)
                    onRequestClose?.()
                  },
                },
              )
            } else {
              return child
            }
          })}
        </AnimatedShape>
      </Modal>
    </Portal>
  )
}

interface ItemProps
  extends AnimatedProps<Omit<TouchableOpacityProps, 'children'>> {
  leadingIcon?: IconName
  trailingIcon?: IconName
  title: string
}

const MenuItem: FC<ItemProps> = ({
  leadingIcon,
  trailingIcon,
  title,
  disabled,
  style,
  ...props
}) => {
  return (
    <AnimatedTouchableOpacity style={style} disabled={disabled} {...props}>
      <Animated.View
        style={[styles.item_container, disabled && styles.item_disabled]}
      >
        <Animated.View style={styles.leading_container}>
          {leadingIcon && <Icon name={leadingIcon} size={18} />}
          <Text variant="titleSmall" children={title} />
        </Animated.View>
        {trailingIcon && <Icon name={trailingIcon} size={18} />}
      </Animated.View>
    </AnimatedTouchableOpacity>
  )
}

interface MenuSelectItemProps extends Omit<TouchableOpacityProps, 'children'> {
  title: string
  isSelected?: boolean
  style?: StyleProp<ViewStyle>
}

const MenuSelectItem: FC<MenuSelectItemProps> = ({
  isSelected,
  title,
  style,
  ...props
}) => {
  const { colors } = useTheme()

  const backgroundColor = isSelected
    ? colors.secondaryContainer
    : colors.surface

  const contentColor = isSelected
    ? colors.onSecondaryContainer
    : colors.onSurface

  return (
    <TouchableOpacity style={[{ backgroundColor }, style]} {...props}>
      <View style={styles.select_item_container}>
        <Text
          variant="bodyMedium"
          style={{ color: contentColor }}
          children={title}
        />
        <Icon
          name="checkmark-outline"
          size={20}
          color={contentColor}
          style={!isSelected && styles.check_item_inactive}
        />
      </View>
    </TouchableOpacity>
  )
}

Menu.Item = MenuItem
Menu.SelectItem = MenuSelectItem

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content_container: {
    position: 'absolute',
    overflow: 'hidden',
  },
  backdrop: {
    flex: 1,
  },
  item_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    gap: 12,
  },
  item_disabled: {
    opacity: 0.5,
  },
  leading_container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  select_item_container: {
    flexDirection: 'row',
    padding: 16,
    gap: 32,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  check_item_inactive: {
    opacity: 0,
  },
})

const easing = Easing.out(Easing.poly(2))

function getPosition(
  anchor?: MeasuredDimensions | null,
  window?: { width: number; height: number } | null,
  content?: { width: number; height: number } | null,
  insets: EdgeInsets = { bottom: 0, top: 0, left: 0, right: 0 },
): ViewStyle {
  'worklet'
  if (!anchor || !window || !content) return {}

  let top: number
  let bottom: number | undefined
  let left: number
  let right: number | undefined

  const safeHeight = window.height - insets.top - insets.bottom
  const safeWidth = window.width - insets.left - insets.right
  const isLeft = anchor.pageX + anchor.width / 2 < window.width / 2

  if (content.height >= safeHeight) {
    top = insets.top
    bottom = insets.bottom
  } else if (
    content.height >
    window.height - insets.bottom - anchor.pageY - anchor.height
  ) {
    top = window.height - content.height - insets.bottom
  } else {
    top = anchor.pageY + anchor.height
  }

  if (content.width >= safeWidth) {
    left = insets.left
    right = insets.right
  } else if (isLeft) {
    if (content.width > window.width - insets.right - anchor.pageX) {
      left = window.width - content.width
    } else {
      left = anchor.pageX
    }
  } else {
    if (content.width > anchor.pageX + anchor.width - insets.left) {
      left = insets.left
    } else {
      left = anchor.pageX + anchor.width - content.width
    }
  }

  const fromLeft = anchor.pageX + anchor.width / 2 - left
  const fromTop = anchor.pageY + anchor.height / 2 - top

  return {
    top,
    left,
    bottom,
    right,
    transformOrigin: [fromLeft, fromTop, 0],
  }
}

export default Menu
export type { MenuProps }
