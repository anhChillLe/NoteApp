import { useRoute } from '@react-navigation/native'
import { RootKeys, RootScreenRouteProps } from '~/navigation/Root/params'

export const useRootRoute = <T extends RootKeys>() =>
  useRoute<RootScreenRouteProps<T>>()
