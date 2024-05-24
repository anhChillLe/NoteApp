import { FC, ReactElement } from 'react'
import { StyleProp, StyleSheet, TextStyle, View, ViewProps } from 'react-native'
import { IconButton, useTheme } from 'react-native-paper'
import Animated, {
  AnimatedProps,
  AnimatedStyle,
  useAnimatedRef,
} from 'react-native-reanimated'
import { AnimatedPaper } from '~/components/Animated'
import { Menu } from '~/components/atoms'
import { useVisible } from '~/hooks'

interface Props extends AnimatedProps<ViewProps> {
  onBackPress: () => void
  title: string
  titleStyle?:
    | StyleProp<TextStyle>
    | StyleProp<AnimatedStyle<StyleProp<TextStyle>>>
  menuContent?: ReactElement
}

export const Appbar: FC<Props> = ({
  style,
  onBackPress,
  titleStyle,
  title,
  menuContent,
  ...props
}) => {
  const { colors, roundness } = useTheme()
  const menuIcon = useAnimatedRef<View>()

  const [visible, showMenu, hideMenu] = useVisible(false)

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
        {!!menuContent && (
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
              {menuContent}
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
    padding: 16,
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
