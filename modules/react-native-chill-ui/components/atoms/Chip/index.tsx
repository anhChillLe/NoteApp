import { FC, Ref } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native'
import { MD3Colors, useTheme } from '../../../styles/ThemeProvider'
import Icon, { IconName } from '../Icon'

type ChipMode = 'outlined' | 'contained-tonal' | 'contained'
interface ChipProps extends ViewProps {
  ref?: Ref<View>
  mode?: ChipMode
  icon?: IconName
}
const Chip: FC<ChipProps> = ({
  ref,
  mode = 'contained-tonal',
  style,
  icon,
  ...props
}) => {
  const { colors } = useTheme()
  return (
    <TouchableOpacity
      ref={ref}
      style={[
        {
          backgroundColor: getContainerColor(mode, colors),
        },
        mode === 'outlined' && getOutlinedStyle(colors),
        styles.container,
        style,
      ]}
      {...props}
    >
      {icon && (
        <Icon name={icon} size={14} color={getLabelColor(mode, colors)} />
      )}
      <Text
        children={props.children}
        style={[{ color: getLabelColor(mode, colors) }, styles.label]}
      />
    </TouchableOpacity>
  )
}

const getContainerColor = (mode: ChipMode, colors: MD3Colors) => {
  switch (mode) {
    case 'outlined':
      return colors.surface
    case 'contained-tonal':
      return colors.primaryContainer
    case 'contained':
      return colors.primary
  }
}

const getLabelColor = (mode: ChipMode, colors: MD3Colors) => {
  switch (mode) {
    case 'outlined':
      return colors.onSurface
    case 'contained-tonal':
      return colors.onPrimaryContainer
    case 'contained':
      return colors.onPrimary
  }
}

const getOutlinedStyle = (colors: MD3Colors): ViewStyle => {
  return {
    borderColor: colors.outlineVariant,
    borderWidth: 1,
  }
}

const styles = StyleSheet.create({
  container: {
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  label: {
    fontSize: 14,
  },
})

export default Chip
export type { ChipProps }
