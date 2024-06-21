import { RouteProp } from '@react-navigation/native'

export type RootStackParamList = {
  onboarding: undefined
  home: undefined
  editor: {
    type: NoteType
    id?: string | null
    tagId?: string | null
    isPrivate?: boolean
  }
  tag_init: undefined
  tag_manager: undefined
  setting: undefined
  trash: undefined
  private: undefined
  createPassword: undefined
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
