import { TextEditor } from '~/components/molecules/Editor/Text'
import { EditorToolbar } from './Toolbar'
import { memo } from 'react'
import { TaskListItemEditor } from './TaskListItem'

export const Editor = {
  Text: memo(TextEditor),
  Toolbar: memo(EditorToolbar),
  TaskListItem: memo(TaskListItemEditor),
}
