import React, { FC, ReactElement, isValidElement } from 'react'
import { AccessibilityProps, StyleSheet, View, ViewProps } from 'react-native'
import Animated, {
  AnimatedProps,
  useAnimatedRef,
} from 'react-native-reanimated'
import { useVisible } from '~/hooks'
import { useTheme } from '../../../styles/ThemeProvider'
import {
  IconButton,
  IconButtonProps,
  IconName,
  Text,
  TextProps,
} from '../../atoms'
import Menu from '../Menu'

interface AppbarProps extends AnimatedProps<ViewProps> {
  children?: React.ReactNode
}

type AppbarType = FC<AppbarProps> & {
  Action: FC<ActionProps>
  BackAction: FC<Partial<IconButtonProps>>
  Title: FC<TextProps>
}

const AnimatedText = Animated.createAnimatedComponent(Text)
const AnimatedIconButton = Animated.createAnimatedComponent(IconButton)
const Appbar: AppbarType = ({ style, children, ...props }) => {
  const { colors, roundness } = useTheme()
  const menuIcon = useAnimatedRef<View>()
  const [visible, showMenu, hideMenu] = useVisible(false)

  const visibleAction: ReactElement[] = []
  const unVisibleAction: ReactElement[] = []
  let titleElement: ReactElement | null = null
  let backElement: ReactElement | null = null
  React.Children.toArray(children).forEach(child => {
    if (!isValidElement(child)) return
    if (child.type === AppbarAction) {
      if (child.props.visible === true) {
        visibleAction.push(child)
      } else {
        unVisibleAction.push(child)
      }
    } else if (child.type === AppbarTitle) {
      titleElement = child
    } else if (child.type === AppbarBackAction) {
      backElement = child
    }
  })

  return (
    <Animated.View style={[styles.app_bar, style]} {...props}>
      <View style={styles.left}>{backElement}</View>
      {titleElement}
      <View style={styles.right}>
        {visibleAction}
        {unVisibleAction.length !== 0 && (
          <>
            <AnimatedIconButton
              ref={menuIcon}
              icon="ellipsis-vertical-outline"
              onPress={showMenu}
            />
            <Menu
              visible={visible}
              anchorRef={menuIcon}
              onRequestClose={hideMenu}
              style={[
                styles.menu,
                {
                  borderRadius: roundness * 3,
                  backgroundColor: colors.background,
                },
              ]}
            >
              {unVisibleAction}
            </Menu>
          </>
        )}
      </View>
    </Animated.View>
  )
}

const AppbarTitle: FC<TextProps> = ({
  style,
  variant = 'titleLarge',
  ...props
}) => {
  return (
    <AnimatedText
      variant={variant as never}
      style={[styles.app_bar_title, style]}
      {...props}
    />
  )
}

type ActionProps = AccessibilityProps &
  (
    | {
        icon?: IconName
        title?: undefined
        visible: true
        disable?: boolean
        onPress?: () => void
      }
    | {
        icon: IconName
        title: string
        visible: false
        disable?: boolean
        onPress?: () => void
      }
  )

const AppbarAction: FC<ActionProps> = ({
  icon,
  visible,
  title,
  disable,
  onPress,
  ...props
}) => {
  if (visible) {
    return (
      <IconButton
        icon={icon!}
        disabled={disable}
        onPress={onPress}
        {...props}
      />
    )
  } else {
    return (
      <Menu.Item
        title={title}
        leadingIcon={icon}
        disabled={disable}
        onPress={onPress}
        {...props}
      />
    )
  }
}

const AppbarBackAction: FC<Partial<IconButtonProps>> = ({
  icon = 'chevron-back',
  ...props
}) => {
  return <IconButton icon={icon} {...props} />
}

Appbar.Action = AppbarAction
Appbar.Title = AppbarTitle
Appbar.BackAction = AppbarBackAction

const styles = StyleSheet.create({
  app_bar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  app_bar_title: {
    fontWeight: '600',
  },
  menu: {
    padding: 8,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  right: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
})

export default Appbar
export type { AppbarProps }
