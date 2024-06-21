import { FC } from 'react'
import { StyleProp, StyleSheet, TextStyle, View, ViewProps } from 'react-native'
import { IconButton, useTheme } from 'react-native-paper'
import Animated, {
  AnimatedProps,
  useAnimatedRef,
} from 'react-native-reanimated'
import { AnimatedPaper } from '~/components/Animated'
import { Menu } from '~/components/atoms'
import { MenuItem } from '~/components/molecules'
import { useVisible } from '~/hooks'

type Action = {
  icon?: string
  title?: string
  visible?: boolean
  disable?: boolean
  onPress?: () => void
}

interface Props extends AnimatedProps<ViewProps> {
  onBackPress: () => void
  title?: string
  titleStyle?: StyleProp<TextStyle>
  actions?: Action[]
}

const Appbar: FC<Props> = ({
  style,
  actions = [],
  onBackPress,
  titleStyle,
  title,
  ...props
}) => {
  const { colors, roundness } = useTheme()
  const menuIcon = useAnimatedRef<View>()
  const [visible, showMenu, hideMenu] = useVisible(false)

  const visibleItem = actions.filter(it => it.visible === true)
  const unVisbileItem = actions.filter(it => it.visible !== true)

  return (
    <Animated.View style={[styles.app_bar, style]} {...props}>
      <View style={styles.left}>
        <IconButton icon="angle-left" onPress={onBackPress} />
      </View>
      <AnimatedPaper.Text
        variant="titleLarge"
        style={[styles.app_bar_title, titleStyle]}
      >
        {title}
      </AnimatedPaper.Text>
      <View style={styles.right}>
        {visibleItem.map((item, index) => {
          const { icon, disable, onPress } = item
          return (
            <IconButton
              key={index}
              icon={icon!}
              disabled={disable}
              onPress={onPress}
            />
          )
        })}
        {unVisbileItem.length !== 0 && (
          <>
            <AnimatedPaper.IconButton
              ref={menuIcon}
              icon="menu-dots-vertical"
              onPress={showMenu}
            />
            <Menu
              visible={visible}
              anchorRef={menuIcon}
              onDismiss={hideMenu}
              onRequestClose={hideMenu}
              style={[
                {
                  borderRadius: roundness * 3,
                  backgroundColor: colors.background,
                },
                styles.menu,
              ]}
            >
              {unVisbileItem.map((item, index) => {
                const { icon, title = '', disable = false, onPress } = item

                return (
                  <MenuItem
                    key={index}
                    title={title}
                    leadingIcon={icon}
                    disabled={disable}
                    onPress={onPress}
                  />
                )
              })}
            </Menu>
          </>
        )}
      </View>
    </Animated.View>
  )
}

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
