import { StaticScreenProps, useNavigation } from '@react-navigation/native'
import {
  Note,
  NoteType,
  Tag,
  useObject,
  useQuery,
  useRealm,
} from 'note-app-database'
import { FC, useEffect, useState } from 'react'
import { BSON, Realm } from 'realm'
import { useDebounce } from '~/hooks'
import EditorScreenLayout from './Layout'
import { NoteEditData, NoteEditProvider } from './Provider'

type Params =
  | { id: string }
  | {
      type: NoteType
      tagId?: string | null
      isPrivate?: boolean
    }

type Props = StaticScreenProps<Params>

const initialData: NoteEditData = {
  type: 'note',
  title: '',
  content: '',
  taskList: [],
  tags: [],
  isPinned: false,
  isPrivate: false,
  isDeleted: false,
}

const getInititalData = (params: Params, realm: Realm) => {
  if ('id' in params) {
    const id = new BSON.UUID('id' in params ? params.id : undefined)
    const note = realm.objectForPrimaryKey(Note, id)
    return {
      ...(note?.data ?? initialData),
      taskList: (note?.taskList ?? []).map(it => ({
        ...it,
        id: new BSON.UUID(),
      })),
    }
  } else {
    if (params.tagId) {
      const tag = realm.objectForPrimaryKey(Tag, new BSON.UUID(params.tagId))
      if (tag) {
        return { ...initialData, tags: [tag] }
      }
    }
    return { ...initialData, type: params.type }
  }
}

const EditorScreen: FC<Props> = ({ route }) => {
  const params = route.params
  const navigation = useNavigation()
  const allTags = useQuery({ type: Tag })
  const realm = useRealm()
  const [id, setId] = useState(
    'id' in params ? new BSON.UUID(params.id) : undefined,
  )
  const note = useObject({
    type: Note,
    primaryKey: new BSON.UUID(id),
    keyPaths: ['updateAt'],
  })
  const { data, ...actions } = useForm(() => getInititalData(params, realm))

  const openTagEditor = () => {
    navigation.navigate('tag_editor')
  }

  const openDetail = () => {
    if (note) {
      navigation.navigate('note_detail', { id: note.id })
    }
  }

  const debouncedData = useDebounce(data, 300)

  useEffect(() => {
    if (!Note.isValidData(debouncedData)) return
    const note = realm.objectForPrimaryKey(Note, id)

    realm.write(() => {
      if (note) {
        note.update(debouncedData)
      } else {
        const result = Note.create(realm, debouncedData)
        setId(result._id)
      }
    })
  }, [debouncedData, id, realm])

  return (
    <NoteEditProvider
      value={{
        ...data,
        ...actions,
        note,
        allTags,
        goBack: navigation.goBack,
        openTagEditor,
        openDetail,
      }}
    >
      <EditorScreenLayout />
    </NoteEditProvider>
  )
}

const useForm = (initialData: () => NoteEditData) => {
  const [data, setData] = useState(initialData)

  const setTitle = (text: string) => {
    setData(prev => ({ ...prev, title: text }))
  }

  const setContent = (text: string) => {
    setData(prev => ({ ...prev, content: text }))
  }

  const addTaskItem = (label: string) => {
    setData(prev => ({
      ...prev,
      taskList: [
        ...prev.taskList,
        { id: new BSON.UUID(), isChecked: false, label },
      ],
    }))
  }

  const setTaskItemLabel = (index: number, label: string) => {
    setData(prev => ({
      ...prev,
      taskList: prev.taskList.map((item, i) =>
        i === index ? { ...item, label } : item,
      ),
    }))
  }

  const changeTaskItemStatus = (index: number) => {
    setData(prev => ({
      ...prev,
      taskList: prev.taskList.map((item, i) =>
        i === index ? { ...item, isChecked: !item.isChecked } : item,
      ),
    }))
  }

  const removeTaskItem = (index: number) => {
    setData(prev => ({
      ...prev,
      taskList: prev.taskList.filter((_, i) => i !== index),
    }))
  }

  const setTags = (tags: Tag[]) => {
    setData(prev => ({ ...prev, tags }))
  }

  const setIsPinned = (isPinned: boolean) => {
    setData(prev => ({ ...prev, isPinned }))
  }

  const setIsPrivate = (isPrivate: boolean) => {
    setData(prev => ({ ...prev, isPrivate }))
  }

  const setIsDeleted = (isDeleted: boolean) => {
    setData(prev => ({ ...prev, isDeleted }))
  }

  return {
    data,
    setTitle,
    setContent,
    addTaskItem,
    setTaskItemLabel,
    changeTaskItemStatus,
    removeTaskItem,
    setTags,
    setIsPinned,
    setIsPrivate,
    setIsDeleted,
  }
}

export default EditorScreen
