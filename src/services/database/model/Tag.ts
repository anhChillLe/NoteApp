import { BSON, ObjectSchema, PropertiesTypes, Realm } from 'realm'

export class Tag extends Realm.Object<Tag, 'name'> {
  _id!: BSON.UUID
  name!: string
  isPinned!: boolean
  createAt!: Date
  updateAt!: Date

  private static properties: PropertiesTypes = {
    _id: 'uuid',
    name: { type: 'string', indexed: 'full-text' },
    isPinned: 'bool',
    createAt: 'date',
    updateAt: 'date',
  }

  static schema: ObjectSchema = {
    name: 'Tag',
    primaryKey: '_id',
    properties: this.properties,
  }

  static generate({
    name,
    isPinned = false,
  }: {
    name: string
    isPinned?: boolean
  }) {
    return {
      _id: new BSON.UUID(),
      name,
      isPinned,
      createAt: new Date(),
      updateAt: new Date(),
    }
  }
}
