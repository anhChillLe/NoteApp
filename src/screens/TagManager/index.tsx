import {
  StaticScreenProps,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native'
import { Tag, useQuery, useRealm } from 'note-app-database'
import { FC, useCallback, useState } from 'react'
import { BackHandler } from 'react-native'
import { BSON, Results } from 'realm'
import { useSelection } from '~/hooks'
import TagManagerLayout from './Layout'
import { TagManagerProvider } from './Provider'

type Props = StaticScreenProps<undefined>
type Mode = 'default' | 'select'

const TagManagerScreen: FC<Props> = () => {
  const realm = useRealm()
  const { goBack, navigate } = useNavigation()
  const tags = useQuery({ type: Tag, query: tagQuery })
  const [mode, setMode] = useState<Mode>('default')

  const [selecteds, select, selectAll] = useSelection(mode === 'select')
  const getSelectedItems = () => {
    if (selecteds === 'all') {
      return tags
    } else {
      const idsArray = Array.from(selecteds).map(it => new BSON.UUID(it))
      return realm.objects(Tag).filtered('_id IN $0', idsArray)
    }
  }

  const togglePinTags = () => {
    realm.write(() => {
      const items = getSelectedItems()
      items.forEach(item => {
        item.isPinned = !item.isPinned
      })
    })
  }

  const deleteTags = () => {
    realm.write(() => {
      const items = getSelectedItems()
      realm.delete(items)
    })
  }

  const openTagEditor = () => {
    const items = getSelectedItems()
    const id = items[0]?.id
    navigate('tag_editor', id ? { id } : undefined)
  }

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (mode === 'select') {
          setMode('default')
          return true
        }
        return false
      }

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      )

      return subscription.remove
    }, [mode]),
  )

  return (
    <TagManagerProvider
      value={{
        goBack,
        tags,
        mode,
        setMode,
        selecteds,
        select,
        selectAll,
        togglePinTags,
        deleteTags,
        openTagEditor,
      }}
    >
      <TagManagerLayout />
    </TagManagerProvider>
  )
}

const tagQuery = (collection: Results<Tag>) =>
  collection.sorted([
    ['isPinned', true],
    ['createAt', false],
  ])

export default TagManagerScreen
