import { FC, useState } from 'react'
import { Chip, Menu } from 'react-native-paper'
import { List } from 'realm'
import { Tag } from '~/services/database/model'

interface Props {
  currentTag: Tag | null | undefined
  tags?: Tag[] | List<Tag>
  onTagPress: (tag: Tag) => void
}

export const TagMenu: FC<Props> = ({ currentTag, tags, onTagPress }) => {
  const [visible, setVisible] = useState(false)
  return (
    <Menu
      elevation={1}
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchorPosition="bottom"
      anchor={
        <Chip
          onPress={() => setVisible(true)}
          icon={currentTag ? undefined : 'plus-small'}
        >
          {currentTag?.name ?? 'Add tag'}
        </Chip>
      }
    >
      {tags?.map(tag => {
        return (
          <Menu.Item
            key={tag._objectKey()}
            title={tag.name}
            onPress={() => {
              onTagPress(tag)
              setVisible(false)
            }}
          />
        )
      })}
    </Menu>
  )
}
