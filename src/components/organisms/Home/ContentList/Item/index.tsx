import { NoteListItem } from '~/components/molecules'
import withTagDetector from './hoc'

const DetectTagNoteListItem = withTagDetector(NoteListItem)

export { DetectTagNoteListItem }
