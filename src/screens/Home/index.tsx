import {
  StaticScreenProps,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native'
import {
  Note,
  Tag,
  TaskItem,
  combineQuery,
  normalize,
  useObject,
  useQuery,
  useRealm,
} from 'note-app-database'
import { FC, useEffect, useState } from 'react'
import { BackHandler } from 'react-native'
import Realm, { BSON, Results, SortDescriptor } from 'realm'
import { useDebounce, useSelection } from '~/hooks'
import { useSetting, SortType } from '~/app/providers/settings'
import HomeScreenLayout from './Layout'
import { HomeMode, HomeContext } from './Provider'

type Props = StaticScreenProps<undefined>

const HomeScreen: FC<Props> = () => {
  const modes = useHomeMode()
  const searchs = useHomeSearch(modes.mode === 'search')
  const navigationActions = useHomeNavigationActions()

  const [currentTagId, setCurrentTagId] = useState<string | null>(null)
  const tags = useQuery({ type: Tag, query: createTagQuery() })
  const notes = useNotes(currentTagId, searchs.searchValue)
  const selections = useHomeSelections(notes, modes.mode === 'select')

  return (
    <HomeContext
      value={{
        notes,
        tags,
        currentTagId,
        setCurrentTagId,
        ...modes,
        ...searchs,
        ...navigationActions,
        ...selections,
      }}
    >
      <HomeScreenLayout />
    </HomeContext>
  )
}

const useHomeNavigationActions = () => {
  const navigation = useNavigation()

  const openEditor = (item: Note) => {
    navigation.navigate('note_view', { id: item.id })
  }

  const openDeletedNote = () => {
    navigation.navigate('trash')
  }

  const openPrivateNote = () => {
    navigation.navigate('private')
  }

  const openTagManager = () => {
    navigation.navigate('tag_manager')
  }

  const openSetting = () => {
    navigation.navigate('setting')
  }

  const openNewNoteEditor = (currentTagId: string | null) => {
    navigation.navigate('editor', { type: 'note', tagId: currentTagId })
  }

  const openNewNoteEditorWithTag = (tagId: string) => {
    navigation.navigate('editor', { type: 'note', tagId })
  }

  const openNewTaskEditor = (currentTagId: string | null) => {
    navigation.navigate('editor', { type: 'task', tagId: currentTagId })
  }

  return {
    openEditor,
    openDeletedNote,
    openPrivateNote,
    openTagManager,
    openSetting,
    openNewNoteEditor,
    openNewNoteEditorWithTag,
    openNewTaskEditor,
  }
}

const useHomeSelections = (notes: Results<Note>, isActive: boolean) => {
  const realm = useRealm()
  const [selecteds, select, selectAll] = useSelection(isActive)

  const getSelectedItems = () => {
    if (selecteds === 'all') {
      return notes
    } else {
      const idsArray = Array.from(selecteds).map(it => new BSON.UUID(it))
      return realm.objects(Note).filtered('_id IN $0', idsArray)
    }
  }

  const isAllPinned = getSelectedItems().every(it => it.isPinned)

  const pinNotes = () => {
    realm.write(() => {
      const items = getSelectedItems()
      items.forEach(item => {
        item.pin()
      })
    })
  }

  const unPinNotes = () => {
    realm.write(() => {
      const items = getSelectedItems()
      items.forEach(item => item.unPin())
    })
  }

  const deleteNotes = () => {
    realm.write(() => {
      const items = getSelectedItems()
      items.forEach(item => item.sendToTrash())
    })
  }

  const privateNotes = () => {
    realm.write(() => {
      const items = getSelectedItems()
      items.forEach(item => item.sendToPrivate())
    })
  }

  const addTagToNote = (note: Note, tag: Tag) => {
    realm.write(() => {
      note.addTag(tag)
    })
  }

  const changeTaskItemStatus = (taskItem: TaskItem) => {
    realm.write(() => {
      taskItem.changeStatus()
    })
  }

  const navigation = useNavigation()
  const openReminder = () => {
    const id = [...selecteds][0]
    if (id) {
      navigation.navigate('set_reminder', { id })
    }
  }

  return {
    selecteds,
    isAllPinned,
    select,
    selectAll,
    pinNotes,
    unPinNotes,
    privateNotes,
    deleteNotes,
    addTagToNote,
    changeTaskItemStatus,
    openReminder,
  }
}

const useHomeSearch = (isActive: boolean) => {
  const [searchValue, setSearchValue] = useState<string>('')
  useEffect(() => {
    setSearchValue('')
  }, [isActive])
  return {
    searchValue,
    setSearchValue,
  }
}

const useHomeMode = () => {
  const [mode, setMode] = useState<HomeMode>('default')
  const handler = () => {
    const listener = BackHandler.addEventListener('hardwareBackPress', () => {
      mode !== 'default' && setMode('default')
      return mode !== 'default'
    })
    return listener.remove
  }

  useFocusEffect(handler)

  return {
    mode,
    setMode,
  }
}

const useNotes = (currentTagId: string | null, searchValue: string) => {
  const currentTag = useObject({
    type: Tag,
    primaryKey: new BSON.UUID(currentTagId!),
  })
  const debouncedSearchValue = useDebounce(searchValue, 300)
  const { sortType: listSortType } = useSetting()
  const notes = useQuery(
    {
      type: Note,
      query: createNoteQuery(listSortType, currentTag, debouncedSearchValue),
    },
    [currentTag, debouncedSearchValue, listSortType],
  )

  return notes
}

function createNoteQuery(
  sortType: SortType,
  tag: Tag | null,
  searchValue: string | null,
) {
  return (collection: Realm.Results<Note>) => {
    const query = combineQuery(
      queryDefault(sortType),
      queryByText(searchValue),
      queryByTag(tag),
    )
    return query(collection)
  }
}

const queryDefault = (sortType: SortType = 'update') => {
  const sortDescriptor: SortDescriptor[] = [
    ['isPinned', true],
    sortType === 'update' ? ['updateAt', true] : ['createAt', true],
  ]
  return (collection: Results<Note>) => {
    return collection
      .filtered('isDeleted == false AND isPrivate == false')
      .sorted(sortDescriptor)
  }
}

const txtQuery =
  'normalizedTitle TEXT $0 OR normalizedContent TEXT $0 OR taskList.normalizedLabel TEXT $0'
const queryByText = (text: string | null) => {
  return (collection: Results<Note>) => {
    const normalizedText = normalize(text ?? '')
    return normalizedText
      ? collection.filtered(txtQuery, normalizedText)
      : collection
  }
}

const queryByTag = (tag: Tag | null) => {
  return (collection: Results<Note>) => {
    return tag === null ? collection : collection.filtered('$0 IN tags', tag)
  }
}

function createTagQuery() {
  return (collection: Realm.Results<Tag>) => {
    return collection.sorted('isPinned', true)
  }
}

export default HomeScreen
