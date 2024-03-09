import { useRoute } from "@react-navigation/native"
import { RootKeys, RootScreenRouteProps } from "~/navigation/root/params"

export const useRootRoute = <T extends RootKeys>() => useRoute<RootScreenRouteProps<T>>()