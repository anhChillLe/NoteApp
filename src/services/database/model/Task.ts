import { BSON, List, Object, ObjectSchema, PropertiesTypes } from 'realm'
import { TaskItem } from './TaskItem'

export class Task extends Object<Task> {
  _id!: BSON.UUID
  title!: string
  items!: List<TaskItem>
  createAt!: Date
  updateAt!: Date

  private static properties: PropertiesTypes = {
    _id: 'uuid',
    title: { type: 'string', indexed: 'full-text' },
    items: 'TaskItem[]',
    createAt: 'date',
    updateAt: 'date',
  }

  static schema: ObjectSchema = {
    name: 'Task',
    primaryKey: '_id',
    properties: this.properties,
  }

  static generate({ title }: { title: string }) {
    return {
      _id: new BSON.UUID(),
      title,
      items: [],
      createAt: new Date(),
      updateAt: new Date(),
    }
  }

  addItem(item: TaskItem){
    this.items.push(item)
  }
}
