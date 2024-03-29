import { BSON, List, Object, ObjectSchema, PropertiesTypes } from 'realm'
import { TaskItem } from './TaskItem'
import { Tag } from './Tag'
import { Style } from './Style'

export class Task extends Object<Task> {
  _id!: BSON.UUID
  title!: string
  items!: List<TaskItem>
  importantLevel!: ImportantLevel
  tag: Tag | null = null
  style: Style | null = null
  createAt!: Date
  updateAt!: Date

  private static properties: PropertiesTypes = {
    _id: 'uuid',
    title: { type: 'string', indexed: 'full-text' },
    items: 'TaskItem[]',
    importantLevel: 'string',
    createAt: 'date',
    updateAt: 'date',
    tag: 'Tag?',
    style: 'Style?',
  }

  static readonly schema: ObjectSchema = {
    name: 'Task',
    primaryKey: '_id',
    properties: this.properties,
  }

  static generate({
    title,
    items = [],
    importantLevel = 'default',
    tag,
    style,
  }: {
    title: string
    items?: { label: string; status: TaskItemStatus }[]
    importantLevel?: ImportantLevel
    tag?: Tag | null
    style?: Style | null
  }) {
    return {
      _id: new BSON.UUID(),
      title,
      items,
      importantLevel,
      tag,
      style,
      createAt: new Date(),
      updateAt: new Date(),
    }
  }

  /**
   * Use it inside realm.write() scope
   */
  update({
    title,
    items,
    importantLevel,
    tag,
    style,
  }: {
    title?: string
    items?: { label: string; status: TaskItemStatus }[]
    importantLevel?: ImportantLevel
    tag?: Tag | null
    style?: Style | null
  }) {
    if (title != undefined) {
      this.title = title
    }
    if (items != undefined) {
      this.items = items as unknown as List<TaskItem>
    }
    if (importantLevel != undefined) {
      this.importantLevel = importantLevel
    }
    if (tag != undefined) {
      this.tag = tag
    }
    if (style != undefined) {
      this.style = style
    }
    this.updateAt = new Date()
  }

  get data() {
    return {
      title: this.title,
      items: this.items.map(it => it.data),
      importantLevel: this.importantLevel,
      tag: this.tag,
      style: this.style,
      createAt: this.createAt,
      updateAt: this.updateAt,
    }
  }

  get id() {
    return this._id.toString()
  }
}
