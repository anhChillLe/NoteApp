import {
  StaticScreenProps,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native'
import { Note, useQuery, useRealm } from 'note-app-database'
import { FC, useState } from 'react'
import { BackHandler } from 'react-native'
import { useSelection } from '~/hooks'
import TrashScreenLayout from './Layout'
import { TrashProvider } from './Provider'
import { BSON } from 'realm'

type Props = StaticScreenProps<undefined>
const TrashScreen: FC<Props> = () => {
  const realm = useRealm()
  const notes = useHidedNotes()
  const { goBack, navigate } = useNavigation()

  const { mode, setMode } = useMode()
  const [selecteds, select, selectAll] = useSelection(mode === 'select')

  const getSelectedItems = () => {
    if (selecteds === 'all') {
      return notes
    } else {
      const idsArray = Array.from(selecteds).map(it => new BSON.UUID(it))
      return realm.objects(Note).filtered('_id IN $0', idsArray)
    }
  }

  const openEditor = (item: Note) => {
    navigate('note_view', { id: item.id })
  }

  const deleteNotes = () => {
    realm.write(() => {
      realm.delete(getSelectedItems())
    })
    setMode('default')
  }

  const restoreNotes = () => {
    realm.write(() => {
      const items = getSelectedItems()
      items.forEach(item => item.removeFromTrash())
    })
    setMode('default')
  }

  return (
    <TrashProvider
      value={{
        goBack,
        notes,
        openEditor,
        mode,
        setMode,
        selecteds,
        selectAll,
        deleteNotes,
        restoreNotes,
        select,
      }}
    >
      <TrashScreenLayout />
    </TrashProvider>
  )
}

const useHidedNotes = () => {
  const notes = useQuery({
    type: Note,
    query: collection => {
      return collection.filtered('isDeleted == true AND isPrivate == false')
    },
  })
  return notes
}

const useMode = () => {
  const [mode, setMode] = useState<'default' | 'select'>('default')
  const backHandler = () => {
    const listener = BackHandler.addEventListener('hardwareBackPress', () => {
      mode === 'select' && setMode('default')
      return mode === 'select'
    })
    return listener.remove
  }
  useFocusEffect(backHandler)

  return { mode, setMode }
}

export default TrashScreen
