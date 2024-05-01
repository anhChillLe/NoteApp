import { BSON, Object, ObjectSchema, PropertiesTypes } from 'realm'
import { Style, Tag, TaskItem } from '~/services/database/model'

export class Note extends Object<Note> {
  _id!: BSON.UUID
  title!: string
  type!: NoteType
  content!: string
  taskList!: TaskItem[]
  createAt!: Date
  updateAt!: Date
  isPinned!: boolean
  isPrivate!: boolean
  isDeleted!: boolean
  tags: Tag[] = []
  style: Style | null = null

  private static properties: PropertiesTypes = {
    _id: 'uuid',
    title: { type: 'string', indexed: 'full-text', default: '' },
    isPinned: { type: 'bool', indexed: true },
    isPrivate: { type: 'bool', default: false },
    isDeleted: { type: 'bool', default: false },
    createAt: 'date',
    updateAt: 'date',
    tags: 'Tag[]',
    style: 'Style?',
    type: { type: 'string', default: 'note' },
    content: { type: 'string', indexed: 'full-text', default: '' },
    taskList: 'TaskItem[]',
  }

  static readonly schema: ObjectSchema = {
    name: 'Note',
    primaryKey: '_id',
    properties: this.properties,
  }

  static generateNote({
    title,
    content = '',
    isPinned = false,
    tags,
    style,
  }: {
    title: string
    content?: string
    isPinned?: boolean
    tags: Tag[]
    style?: Style | null
  }) {
    return {
      _id: new BSON.UUID(),
      title,
      content,
      isPinned,
      type: 'note' as NoteType,
      createAt: new Date(),
      updateAt: new Date(),
      tags,
      style,
    }
  }

  static generateTask({
    title,
    isPinned = false,
    taskList = [],
    tags,
    style,
  }: {
    title: string
    taskList?: { label: string; status: TaskItemStatus }[]
    isPinned?: boolean
    tags: Tag[]
    style?: Style | null
  }) {
    return {
      _id: new BSON.UUID(),
      title,
      type: 'task' as NoteType,
      taskList: taskList as TaskItem[],
      isPinned,
      createAt: new Date(),
      updateAt: new Date(),
      tags,
      style,
    }
  }

  update({
    title,
    content,
    taskList,
    tags,
    isPrivate,
    style,
  }: {
    title?: string
    content?: string
    isPrivate?: boolean
    taskList?: { label: string; status: TaskItemStatus }[]
    tags?: Tag[]
    style?: Style | null
  }) {
    if (title !== undefined) {
      this.title = title
    }
    if (content !== undefined) {
      this.content = content
    }
    if (taskList !== undefined) {
      this.taskList = taskList as TaskItem[]
    }
    if (isPrivate !== undefined) {
      this.isPrivate = isPrivate
    }
    if (tags !== undefined) {
      this.tags = tags
    }
    if (style !== undefined) {
      this.style = style
    }
    this.updateAt = new Date()
  }

  get data() {
    return {
      title: this.title,
      content: this.content,
      createAt: this.createAt,
      updateAt: this.updateAt,
      tags: this.tags,
      taskList: this.taskList.map(it => it.data),
      style: this.style,
    }
  }

  get id() {
    return this._id.toString()
  }
}
