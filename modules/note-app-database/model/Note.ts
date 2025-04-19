import { BSON, Object, ObjectSchema, PropertiesTypes, Realm } from 'realm'
import { Tag, TaskItem } from '../model'
import { normalize } from '../utils'
import { TaskItemData } from './TaskItem'

export type NoteType = 'note' | 'task'

export type NoteData = {
  type: NoteType
  title: string
  content: string
  taskList: TaskItemData[]
  isPrivate: boolean
  isPinned: boolean
  isDeleted: boolean
  tags: Tag[]
}

export class Note extends Object<Note> {
  _id!: BSON.UUID
  title!: string
  normalizedTitle?: string
  type!: NoteType
  content!: string
  normalizedContent?: string
  taskList!: TaskItem[]
  createAt!: Date
  updateAt!: Date
  isPinned!: boolean
  isPrivate!: boolean
  isDeleted!: boolean
  tags!: Tag[]

  private static properties: PropertiesTypes = {
    _id: { type: 'uuid' },
    type: { type: 'string', default: 'note' },
    title: { type: 'string', default: '' },
    content: { type: 'string', default: '' },
    taskList: { type: 'list', objectType: 'TaskItem', default: [] },
    isPinned: { type: 'bool', indexed: true, default: false },
    isPrivate: { type: 'bool', indexed: true, default: false },
    isDeleted: { type: 'bool', indexed: true, default: false },
    tags: { type: 'list', objectType: 'Tag', default: [] },
    createAt: { type: 'date' },
    updateAt: { type: 'date' },
    normalizedTitle: { type: 'string', indexed: 'full-text', default: '' },
    normalizedContent: { type: 'string', indexed: 'full-text', default: '' },
  }

  static readonly schema: ObjectSchema = {
    name: 'Note',
    primaryKey: '_id',
    properties: this.properties,
  }

  get id() {
    return this._id.toString()
  }

  get data() {
    return {
      type: this.type,
      title: this.title,
      content: this.content,
      createAt: this.createAt,
      updateAt: this.updateAt,
      tags: [...this.tags],
      taskList: this.taskList.map(it => it.data),
      isPinned: this.isPinned,
      isPrivate: this.isPrivate,
      isDeleted: this.isDeleted,
    }
  }

  update(data: NoteData) {
    const {
      title,
      content,
      isDeleted,
      isPinned,
      isPrivate,
      tags,
      taskList,
      type,
    } = data
    if (!this.isDeleted) {
      this.title = title
      this.normalizedTitle = normalize(title)
      this.content = content
      this.normalizedContent = normalize(content)
      this.isPinned = isPinned
      this.isPrivate = isPrivate
      this.tags = tags
      this.taskList = taskList.map(task =>
        TaskItem.generate(task),
      ) as unknown as TaskItem[]
      this.type = type
      this.updateAt = new Date()
    }

    this.isDeleted = isDeleted
  }

  static create(
    realm: Realm,
    { type, title, content, taskList, isPinned, isPrivate, tags }: NoteData,
  ) {
    return realm.create(Note, {
      _id: new BSON.UUID(),
      updateAt: new Date(),
      createAt: new Date(),
      normalizedTitle: normalize(title),
      normalizedContent: normalize(content),
      type,
      title,
      content,
      taskList: taskList.map(task =>
        TaskItem.generate(task),
      ) as unknown as TaskItem[],
      isPinned,
      isPrivate,
      tags,
    })
  }

  addTag(tag: Tag) {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag)
    }
  }

  pin() {
    this.isPinned = true
  }

  unPin() {
    this.isPinned = false
  }

  delete(realm: Realm) {
    realm.delete(this)
  }

  sendToPrivate() {
    this.isPrivate = true
  }

  removeFromPrivate() {
    this.isPrivate = false
  }

  sendToTrash() {
    this.isDeleted = true
  }

  removeFromTrash() {
    this.isDeleted = false
  }

  static isValidData({ type, title, content, taskList }: NoteData): boolean {
    if (type === 'note') {
      return !!title || !!content
    } else {
      return !!title || taskList.length !== 0
    }
  }
}
