import { RouteProp } from '@react-navigation/native'

export type RootStackParamList = {
  onboarding: undefined
  home: undefined
  note_edit: { type: NoteType; id?: Readonly<string>; tagId?: Readonly<string> }
  tag_init: undefined
  tag_manager: undefined
  setting: undefined
  deleted: undefined
  private: undefined
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
