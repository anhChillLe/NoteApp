import {
  StaticScreenProps,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native'
import {
  Note,
  Tag,
  combineQuery,
  useObject,
  useQuery,
  useRealm,
} from 'note-app-database'
import { FC, useState } from 'react'
import { BackHandler } from 'react-native'
import { BSON, Results, SortDescriptor } from 'realm'
import { useSelection } from '~/hooks'
import { useSetting, SortType } from '~/app/providers/settings'
import PrivateScreenLayout from './Layout'
import { PrivateMode, PrivateNoteProvider } from './Provider'

type Props = StaticScreenProps<undefined>
const PrivateNoteScreen: FC<Props> = () => {
  const navigation = useNavigation()
  const realm = useRealm()
  const tags = useQuery({ type: Tag })
  const { mode, setMode } = usePrivateMode()
  const [selecteds, select, selectAll] = useSelection(mode === 'select')
  const [currentTagId, changeCurrentTagId] = useState<string | null>(null)
  const notes = useHidedNotes(currentTagId)

  const getSelectedItems = () => {
    if (selecteds === 'all') {
      return notes
    } else {
      const idsArray = Array.from(selecteds).map(it => new BSON.UUID(it))
      return realm.objects(Note).filtered('_id IN $0', idsArray)
    }
  }

  const openEditor = (item: Note) => {
    navigation.navigate('note_view', { id: item.id })
  }

  const openNewNoteEditor = () => {
    navigation.navigate('editor', {
      type: 'note',
      tagId: currentTagId,
      isPrivate: true,
    })
  }

  const openNewTaskEditor = () => {
    navigation.navigate('editor', {
      type: 'task',
      tagId: currentTagId,
      isPrivate: true,
    })
  }

  const addTagToNote = (tag: Tag, note: Note) => {
    realm.write(() => {
      note.addTag(tag)
    })
  }

  const removeFromPrivate = () => {
    realm.write(() => {
      const items = getSelectedItems()
      items.forEach(item => item.removeFromPrivate())
    })
  }

  const deleteItems = () => {
    realm.write(() => {
      realm.delete(selecteds)
    })
  }

  return (
    <PrivateNoteProvider
      value={{
        notes,
        tags,
        currentTagId,
        changeCurrentTagId,
        goBack: navigation.goBack,
        openEditor,
        openNewNoteEditor,
        openNewTaskEditor,
        mode,
        setMode,
        addTagToNote,
        deleteItems,
        removeFromPrivate,
        selecteds,
        select,
        selectAll,
      }}
    >
      <PrivateScreenLayout />
    </PrivateNoteProvider>
  )
}

const usePrivateMode = () => {
  const [mode, setMode] = useState<PrivateMode>('default')

  const focusHanlder = () => {
    const listener = BackHandler.addEventListener('hardwareBackPress', () => {
      mode === 'select' && setMode('default')
      return mode === 'select'
    })
    return listener.remove
  }

  useFocusEffect(focusHanlder)

  return {
    mode,
    setMode,
  }
}

const useHidedNotes = (currentTagId: string | null) => {
  const currentTag = useObject({
    type: Tag,
    primaryKey: new BSON.UUID(currentTagId!),
  })
  const { sortType: listSortType } = useSetting()
  const query = combineQuery(queryDefault(listSortType), queryByTag(currentTag))

  const notes = useQuery(
    {
      type: Note,
      query,
    },
    [currentTag, listSortType],
  )
  return notes
}

const queryByTag = (tag: Tag | null) => {
  return (collection: Results<Note>) => {
    if (!tag) return collection
    return collection.filtered('$0 IN tags', tag)
  }
}

const queryDefault = (sortType: SortType = 'update') => {
  const sortDescriptor: SortDescriptor[] = [
    ['isPinned', true],
    sortType === 'update' ? ['updateAt', true] : ['createAt', true],
  ]
  return (collection: Results<Note>) => {
    return collection
      .filtered('isDeleted == false AND isPrivate == true')
      .sorted(sortDescriptor)
  }
}

export default PrivateNoteScreen
