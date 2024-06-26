import { Object, ObjectSchema, PropertiesTypes } from 'realm'
import { normalize } from '../utils'

export type TaskItemData = { label: string; status: TaskItemStatus }

export class TaskItem extends Object<TaskItem> {
  label!: string
  status!: TaskItemStatus

  private static properties: PropertiesTypes = {
    label: { type: 'string' },
    normalizedLabel: { type: 'string', indexed: 'full-text', default: '' },
    status: { type: 'string', default: '' },
  }

  static readonly schema: ObjectSchema = {
    name: 'TaskItem',
    embedded: true,
    properties: this.properties,
  }

  get data() {
    return {
      label: this.label,
      status: this.status,
    }
  }

  static generate(data: TaskItemData) {
    return {
      ...data,
      normalizedLabel: normalize(data.label),
    }
  }

  changeStatus() {
    switch (this.status) {
      case 'checked':
        this.status = 'unchecked'
        break
      case 'unchecked':
        this.status = 'checked'
        break
      case 'indeterminate':
        return
    }
  }
}
