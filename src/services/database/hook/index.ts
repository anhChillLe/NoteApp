import { useQuery } from '..'
import { Note, Tag, Task } from '../model'

export function useCountByTag(tag: Tag) {
  const taskCount = useQuery(Task, items => items.filtered('tag==$0', tag), [
    tag,
  ]).length
  const noteCount = useQuery(Note, items => items.filtered('tag==$0', tag), [
    tag,
  ]).length

  return {
    task: taskCount,
    note: noteCount,
  }
}
