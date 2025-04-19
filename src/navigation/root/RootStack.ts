import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useAppState } from '~/app/providers/appstate'
import {
  EditorScreen,
  HomeScreen,
  NoteDetailScreen,
  NoteViewScreen,
  OnboardingScreen,
  PrivateNoteScreen,
  SetReminderScreen,
  SettingScreen,
  TagEditorScreen,
  TagInitScreen,
  TagManagerScreen,
  TrashScreen,
} from '~/screens'

const useIsFirstOpen = () => {
  return useAppState().isFirstOpen
}

const RootStack = createNativeStackNavigator({
  screenOptions: {
    headerShown: false,
    animation: 'ios_from_right',
  },
  screens: {
    onboarding: {
      if: useIsFirstOpen,
      screen: OnboardingScreen,
    },
    tag_init: {
      if: useIsFirstOpen,
      screen: TagInitScreen,
    },
    home: {
      screen: HomeScreen,
    },
    editor: {
      screen: EditorScreen,
    },
    tag_manager: {
      screen: TagManagerScreen,
    },
    setting: {
      screen: SettingScreen,
    },
    trash: {
      screen: TrashScreen,
    },
    private: {
      screen: PrivateNoteScreen,
    },
  },
  groups: {
    dialog: {
      screenOptions: {
        presentation: 'containedTransparentModal',
        animation: 'fade',
      },
      screens: {
        tag_editor: {
          screen: TagEditorScreen,
        },
        set_reminder: {
          screen: SetReminderScreen,
        },
        note_view: {
          screen: NoteViewScreen,
        },
        note_detail: {
          screen: NoteDetailScreen,
        },
      },
    },
  },
})

export default RootStack
