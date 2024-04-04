import { RouteProp } from '@react-navigation/native'

export type RootStackParamList = {
  onboarding: undefined
  home: undefined
  note_edit: { readonly id: string } | undefined
  task_edit: { readonly id: string } | undefined
  tag_init: undefined
  tag_manager: undefined
}

export type RootKeys = keyof RootStackParamList

export type RootScreenRouteProps<T extends RootKeys> = RouteProp<
  RootStackParamList,
  T
>

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
