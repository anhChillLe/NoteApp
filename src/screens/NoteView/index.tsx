import {
  StackActions,
  StaticScreenProps,
  useNavigation,
} from '@react-navigation/native'
import { Note, TaskItem, useObject, writeToRealm } from 'note-app-database'
import { FC } from 'react'
import { BSON } from 'realm'
import NoteViewLayout from './Layout'
import { NoteViewProvider } from './Provider'
import { useReminder } from '~/app/providers/notification'

type Props = StaticScreenProps<{ id: string }>
const NoteViewScreen: FC<Props> = ({ route }) => {
  const navigation = useNavigation()
  const note = useObject({
    type: Note,
    primaryKey: new BSON.UUID(route.params.id),
    keyPaths: 'taskList.isChecked',
  })

  const openEditor = () => {
    navigation.dispatch(StackActions.replace('editor', route.params))
  }

  const openReminder = () => {
    navigation.navigate('set_reminder', route.params)
  }

  const openDetail = () => {
    navigation.navigate('note_detail', route.params)
  }

  const changeTaskItemStatus = (taskItem: TaskItem) => {
    if (note?.isDeleted) return
    writeToRealm(() => taskItem.changeStatus())
  }

  const { getTriggerById } = useReminder()
  const currentReminder = getTriggerById(route.params.id)

  if (note === null) {
    navigation.goBack()
    return
  }

  const value = {
    note,
    currentReminder,
    openEditor,
    goBack: navigation.goBack,
    openReminder,
    changeTaskItemStatus,
    openDetail,
  }

  return (
    <NoteViewProvider value={value}>
      <NoteViewLayout />
    </NoteViewProvider>
  )
}

export default NoteViewScreen
