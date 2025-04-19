import React, { FC, ReactElement } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewProps,
} from 'react-native'
import Animated, {
  AnimatedProps,
  BaseAnimationBuilder,
  LayoutAnimationFunction,
} from 'react-native-reanimated'
import { Icon, Text, IconName } from '../../atoms'
import { useTheme } from '../../../styles/ThemeProvider'

interface ActionProps extends AnimatedProps<TouchableOpacityProps> {
  icon: IconName
  title: string
  color?: string
}

interface ActionbarProps extends AnimatedProps<ViewProps> {
  children: React.ReactNode
  itemLayout?:
    | BaseAnimationBuilder
    | LayoutAnimationFunction
    | typeof BaseAnimationBuilder
}

type Actionbar = FC<ActionbarProps> & {
  Action: FC<ActionProps>
}
const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity)
const Actionbar: Actionbar = ({ style, children, itemLayout, ...props }) => {
  const { colors } = useTheme()

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: colors.surfaceVariant },
        style,
      ]}
      {...props}
    >
      {React.Children.toArray(children).map(child => {
        if (React.isValidElement(child) && child.type === ActionBarAction) {
          return React.cloneElement<ActionProps>(
            child as ReactElement<ActionProps>,
            {
              style: [{ flex: 1 }, child.props.style],
              layout: child.props.layout ?? itemLayout,
              color: child.props.color ?? colors.onSurfaceVariant,
            },
          )
        } else {
          return null
        }
      })}
    </Animated.View>
  )
}

const ActionBarAction: FC<ActionProps> = ({
  icon,
  title,
  style,
  disabled,
  color,
  ...props
}) => {
  return (
    <AnimatedTouchableOpacity
      style={[styles.action_container, disabled && styles.disable, style]}
      disabled={disabled}
      activeOpacity={0.5}
      {...props}
    >
      <Icon name={icon} size={20} color={color} />
      <Text
        variant="titleSmall"
        children={title}
        style={[{ color }, styles.action_label]}
      />
    </AnimatedTouchableOpacity>
  )
}

Actionbar.Action = ActionBarAction

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 8,
    justifyContent: 'space-evenly',
  },
  button: {
    margin: 6,
  },
  action_container: {
    gap: 8,
    alignItems: 'center',
    padding: 8,
  },
  action_label: {
    // flex: 1,
  },
  disable: {
    opacity: 0.5,
  },
})

export default Actionbar
export type { ActionbarProps }
