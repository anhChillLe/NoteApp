import { BSON, Object, ObjectSchema, PropertiesTypes } from 'realm'
import { Style, Tag } from '~/services/database/model'

export class Note extends Object<Note> {
  _id!: BSON.UUID
  title!: string
  content!: string
  importantLevel!: ImportantLevel
  createAt!: Date
  updateAt!: Date
  tag: Tag | null = null
  style: Style | null = null

  private static properties: PropertiesTypes = {
    _id: 'uuid',
    title: { type: 'string', indexed: 'full-text' },
    content: { type: 'string', indexed: 'full-text' },
    importantLevel: 'string',
    createAt: 'date',
    updateAt: 'date',
    tag: 'Tag?',
    style: 'Style?',
  }

  static readonly schema: ObjectSchema = {
    name: 'Note',
    primaryKey: '_id',
    properties: this.properties,
  }

  static generate({
    title,
    content,
    importantLevel = 'default',
    tag,
    style,
  }: {
    title: string
    content: string
    importantLevel?: ImportantLevel
    tag?: Tag | null
    style?: Style | null
  }) {
    return {
      _id: new BSON.UUID(),
      title,
      content,
      importantLevel,
      createAt: new Date(),
      updateAt: new Date(),
      tag,
      style,
    }
  }

  update({
    title,
    content,
    importantLevel,
    tag,
    style,
  }: {
    title?: string
    content?: string
    importantLevel?: ImportantLevel
    tag?: Tag | null
    style?: Style | null
  }) {
    if (title !== undefined) {
      this.title = title
    }
    if (content !== undefined) {
      this.content = content
    }
    if (importantLevel !== undefined) {
      this.importantLevel = importantLevel
    }
    if (tag !== undefined) {
      this.tag = tag
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
      importantLevel: this.importantLevel,
      createAt: this.createAt,
      updateAt: this.updateAt,
      tag: this.tag,
      style: this.style,
    }
  }

  get id() {
    return this._id.toString()
  }
}
