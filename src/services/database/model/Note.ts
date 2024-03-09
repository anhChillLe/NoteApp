import { BSON, Object, ObjectSchema, PropertiesTypes } from 'realm'
import { Style, Tag } from '~/services/database/model'

export type ImportantLevel = 'low' | 'default' | 'high' | 'very_high'

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

  static schema: ObjectSchema = {
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
    tag?: Tag
    style?: Style
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
}
