import { FC, LegacyRef, ReactNode } from 'react'
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native'
import Animated from 'react-native-reanimated'
import { Icon, IconName, Switch, Text } from '../../atoms'
import { useTheme } from '../../../styles/ThemeProvider'

interface SectionProps {
  title: string
  children: ReactNode
}

type Section = FC<SectionProps> & {
  Item: FC<SectionItemProps>
}

const Section: Section = ({ title, children }) => {
  return (
    <View style={styles.section_container}>
      <Text children={title} style={styles.list_section_title} />
      {children}
    </View>
  )
}

interface SectionItemProps extends Omit<TouchableOpacityProps, 'children'> {
  title: string
  description?: string
  contentContainerStyle?: StyleProp<ViewStyle>
  style?: StyleProp<ViewStyle>
  value?: string | boolean | null | undefined
  valueRef?: LegacyRef<View>
  mode?: 'picker' | 'direct'
}

const SectionItem: FC<SectionItemProps> = ({
  title,
  value,
  description,
  contentContainerStyle,
  valueRef,
  disabled,
  style,
  mode = 'picker',
  ...props
}) => {
  const { colors } = useTheme()
  return (
    <TouchableOpacity disabled={disabled} style={style} {...props}>
      <View
        pointerEvents="none"
        style={[
          styles.container,
          disabled && styles.disabled,
          contentContainerStyle,
        ]}
      >
        <View style={styles.title_container}>
          <Text style={styles.title} children={title} />
          {!!description && <Text variant="bodySmall" children={description} />}
        </View>
        {typeof value === 'string' ? (
          <Animated.View ref={valueRef} style={styles.value_container}>
            <Text style={styles.value} children={value} />
            <Icon name={Icons[mode]} size={16} color={colors.onSurface} />
          </Animated.View>
        ) : typeof value === 'boolean' ? (
          <Animated.View ref={valueRef} style={styles.value_container}>
            <Switch value={value} pointerEvents="none" />
          </Animated.View>
        ) : (
          <Animated.View ref={valueRef} style={styles.value_container}>
            <Icon name={Icons[mode]} size={16} color={colors.onSurface} />
          </Animated.View>
        )}
      </View>
    </TouchableOpacity>
  )
}

Section.Item = SectionItem

const Icons: Record<'picker' | 'direct', IconName> = {
  picker: 'chevron-expand-outline',
  direct: 'chevron-forward',
}

const styles = StyleSheet.create({
  section_container: {
    paddingVertical: 8,
  },
  container: {
    padding: 16,
    gap: 8,
    alignItems: 'center',
    flexDirection: 'row',
  },
  title_container: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
  },
  value: {
    fontWeight: '500',
  },
  value_container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    opacity: 0.6,
  },
  disabled: {
    opacity: 0.5,
  },
  list_section_title: {
    padding: 16,
    opacity: 0.75,
  },
})

export default Section
export type { SectionProps, SectionItemProps }
