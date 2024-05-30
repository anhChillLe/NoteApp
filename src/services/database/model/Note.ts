import { BSON, Object, ObjectSchema, PropertiesTypes } from 'realm'
import { Style, Tag, TaskItem } from '~/services/database/model'
import { TaskItemData } from './TaskItem'

export type NoteData = {
  type: NoteType
  title?: string
  content?: string
  taskList?: TaskItemData[]
  isPrivate?: boolean
  isPinned?: boolean
  isDeleted?: boolean
  tags?: Tag[]
  style?: Style | null
}

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
    type: { type: 'string', default: 'note' },

    title: { type: 'string', indexed: 'full-text', default: '' },
    content: { type: 'string', indexed: 'full-text', default: '' },
    taskList: 'TaskItem[]',

    isPinned: { type: 'bool', indexed: true, default: false },
    isPrivate: { type: 'bool', indexed: true, default: false },
    isDeleted: { type: 'bool', indexed: true, default: false },

    createAt: 'date',
    updateAt: 'date',

    tags: 'Tag[]',
    style: 'Style?',
  }

  static readonly schema: ObjectSchema = {
    name: 'Note',
    primaryKey: '_id',
    properties: this.properties,
  }

  static generate({
    type,
    title = '',
    content = '',
    taskList = [],
    isPinned = false,
    isPrivate = false,
    tags = [],
    style = null,
  }: NoteData) {
    return {
      _id: new BSON.UUID(),
      type,
      title,
      content,
      taskList: taskList as TaskItem[],
      isPinned,
      isPrivate,
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
    isPinned,
    isDeleted,
    style,
  }: {
    title?: string
    content?: string
    taskList?: TaskItemData[]
    isPrivate?: boolean
    isPinned?: boolean
    isDeleted?: boolean
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
    if (isPinned !== undefined) {
      this.isPinned = isPinned
    }
    if (isPrivate !== undefined) {
      this.isPrivate = isPrivate
    }
    if (isDeleted !== undefined) {
      this.isDeleted = isDeleted
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
      type: this.type,
      title: this.title,
      content: this.content,
      createAt: this.createAt,
      updateAt: this.updateAt,
      tags: this.tags,
      taskList: this.taskList,
      style: this.style,
      isPinned: this.isPinned,
      isPrivate: this.isPrivate,
      isDeleted: this.isDeleted,
    }
  }

  get id() {
    return this._id.toString()
  }
}
