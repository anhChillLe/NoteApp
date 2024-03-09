import { RouteProp } from "@react-navigation/native";

export type RootStackParamList = {
  welcome: {id: string}
}

export type RootKeys = keyof RootStackParamList

export type RootScreenRouteProps<T extends RootKeys> = RouteProp<RootStackParamList, T>

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}