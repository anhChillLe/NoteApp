import { Object, ObjectSchema, PropertiesTypes } from 'realm'

export class TaskItem extends Object<TaskItem> {
  title!: string
  isSelected!: boolean
  createAt!: Date
  updateAt!: Date

  private static properties: PropertiesTypes = {
    title: { type: 'string', indexed: 'full-text' },
    isSelected: 'bool',
    createAt: 'date',
    updateAt: 'date',
  }

  static schema: ObjectSchema = {
    name: 'TaskItem',
    embedded: true,
    properties: this.properties,
  }

  static generate({
    title,
    isSelected = false,
  }: {
    title: string
    isSelected?: boolean
  }) {
    return {
      title,
      isSelected,
      createAt: new Date(),
      updateAt: new Date(),
    }
  }
}
