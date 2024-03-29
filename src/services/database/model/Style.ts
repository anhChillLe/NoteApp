import { BSON, Object, ObjectSchema, PropertiesTypes } from 'realm'

export class Style extends Object<Style> {
  _id: BSON.UUID = new BSON.UUID()
  background!: string
  onBackground!: string
  createAt!: Date
  updateAt!: Date

  private static properties: PropertiesTypes = {
    _id: 'uuid',
    background: 'string',
    onBackground: 'string',
    createAt: 'date',
    updateAt: 'date',
  }

  static readonly schema: ObjectSchema = {
    name: 'Style',
    primaryKey: '_id',
    properties: this.properties,
  }

  static generate({
    background,
    onBackground,
  }: {
    background: string
    onBackground: string
  }) {
    return {
      _id: new BSON.UUID(),
      background,
      onBackground,
      createAt: new Date(),
      updateAt: new Date(),
    }
  }

  get data() {
    return {
      background: this.background,
      onBackground: this.onBackground,
      createAt: this.createAt,
      updateAt: this.updateAt,
    }
  }

  get id() {
    return this._id.toString()
  }
}
