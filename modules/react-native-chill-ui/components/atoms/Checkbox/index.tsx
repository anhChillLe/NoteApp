import { FC, Ref } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native'
import { useTheme } from '../../../styles/ThemeProvider'
import Icon from '../Icon'

interface CheckboxProps extends TouchableOpacityProps {
  ref?: Ref<View>
  status: 'checked' | 'unchecked'
}

const Checkbox: FC<CheckboxProps> = ({ ref, status, style, ...props }) => {
  const theme = useTheme()

  return (
    <TouchableOpacity ref={ref} style={[styles.container, style]} {...props}>
      {status === 'checked' ? (
        <Icon name="checkbox-outline" size={18} color={theme.colors.primary} />
      ) : (
        <Icon name="square-outline" size={18} color={theme.colors.onSurface} />
      )}
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
  container: {
    width: 40,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default Checkbox
export type { CheckboxProps }
