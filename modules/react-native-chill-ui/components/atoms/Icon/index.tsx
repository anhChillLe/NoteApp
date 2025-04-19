import Ionicons from '@react-native-vector-icons/ionicons'
import { ComponentProps, FC, Ref } from 'react'
import { Text } from 'react-native'
import { useTheme } from '../../../styles/ThemeProvider'

type IconsProps = ComponentProps<typeof Ionicons> & {
  ref?: Ref<Text>
}
type IconName = IconsProps['name']

const Icon: FC<IconsProps> = ({ ref, color, ...props }) => {
  const { colors } = useTheme()
  return <Ionicons ref={ref} color={color ?? colors.onSurface} {...props} />
}

export default Icon
export type { IconName, IconsProps }
