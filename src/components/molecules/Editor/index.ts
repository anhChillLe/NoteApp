import { TextEditor } from '~/components/molecules/Editor/Text'
import { EditorToolbar } from './Toolbar'
import { memo } from 'react'
import { TaskListItemEditor } from './TaskListItem'

export namespace Editor {
  export const Text = memo(TextEditor)
  export const Toolbar = memo(EditorToolbar)
  export const TaskListItem = TaskListItemEditor
}
