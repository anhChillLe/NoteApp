import { BSON, ObjectSchema, PropertiesTypes, Realm } from 'realm'

interface TagData {
  name: string
  isPinned: boolean
}

export class Tag extends Realm.Object<Tag, 'name'> {
  _id!: BSON.UUID
  name!: string
  isPinned!: boolean
  createAt!: Date
  updateAt!: Date

  private static properties: PropertiesTypes = {
    _id: 'uuid',
    name: { type: 'string', indexed: 'full-text' },
    isPinned: { type: 'bool', indexed: true },
    createAt: 'date',
    updateAt: 'date',
  }

  static readonly schema: ObjectSchema = {
    name: 'Tag',
    primaryKey: '_id',
    properties: this.properties,
  }

  get id() {
    return this._id.toString()
  }

  get data() {
    return {
      name: this.name,
      isPinned: this.isPinned,
    }
  }

  static create(realm: Realm, data: TagData) {
    if (!data.name) return
    return realm.create(Tag, {
      ...data,
      _id: new BSON.UUID(),
      createAt: new Date(),
      updateAt: new Date(),
    })
  }

  update({ isPinned, name }: TagData) {
    this.name = name
    this.isPinned = isPinned
    this.updateAt = new Date()
  }

  equals(tag: Tag) {
    return this.id === tag.id
  }
}
