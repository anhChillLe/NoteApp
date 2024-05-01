import { NoteListItem, TaskListItem } from '~/components/molecules'
import withTagDetector from './hoc'

const DetectTagNoteListItem = withTagDetector(NoteListItem)
const DetectTagTaskListItem = withTagDetector(TaskListItem)

export { DetectTagNoteListItem, DetectTagTaskListItem }
