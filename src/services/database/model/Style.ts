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

  static schema: ObjectSchema = {
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
}
