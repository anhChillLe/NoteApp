import { FC, useState } from 'react'
import { Menu, Chip } from 'react-native-paper'
import { importantLevelNameMap as name } from '~/constants'

interface Props {
  currentLevel?: ImportantLevel
  onImportantLevelChange: (level: ImportantLevel) => void
}

const data: ImportantLevel[] = ['default', 'low', 'high', 'very_high']

export const ImportantLevelMenu: FC<Props> = ({
  currentLevel = 'default',
  onImportantLevelChange,
}) => {
  const [visible, setVisible] = useState(false)

  return (
    <Menu
      elevation={1}
      onDismiss={() => setVisible(false)}
      anchor={
        <Chip onPress={() => setVisible(true)}>{name[currentLevel]}</Chip>
      }
      anchorPosition="bottom"
      visible={visible}
    >
      {data.map(level => {
        return (
          <Menu.Item
            key={level}
            title={name[level]}
            onPress={() => {
              onImportantLevelChange(level)
              setVisible(false)
            }}
          />
        )
      })}
    </Menu>
  )
}
