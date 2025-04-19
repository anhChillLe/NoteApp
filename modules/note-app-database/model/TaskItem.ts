import { Object, ObjectSchema, PropertiesTypes } from 'realm'
import { normalize } from '../utils'

export type TaskItemData = { label: string; isChecked: boolean }

export class TaskItem extends Object<TaskItem> {
  label!: string
  isChecked!: boolean

  private static properties: PropertiesTypes = {
    label: { type: 'string' },
    normalizedLabel: { type: 'string', indexed: 'full-text', default: '' },
    isChecked: { type: 'bool', default: false },
  }

  static readonly schema: ObjectSchema = {
    name: 'TaskItem',
    embedded: true,
    properties: this.properties,
  }

  get data() {
    return {
      label: this.label,
      isChecked: this.isChecked,
    }
  }

  static generate(data: TaskItemData) {
    return {
      isChecked: data.isChecked,
      label: data.label,
      normalizedLabel: normalize(data.label),
    }
  }

  changeStatus() {
    this.isChecked = !this.isChecked
  }

  equals(item: TaskItem) {
    return this.label === item.label && this.isChecked === item.isChecked
  }
}
