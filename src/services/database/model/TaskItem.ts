import { Object, ObjectSchema, PropertiesTypes } from 'realm'

export class TaskItem extends Object<TaskItem> {
  label!: string
  status!: TaskItemStatus

  private static properties: PropertiesTypes = {
    label: { type: 'string', indexed: 'full-text' },
    status: 'string',
  }

  static readonly schema: ObjectSchema = {
    name: 'TaskItem',
    embedded: true,
    properties: this.properties,
  }

  static generate({
    label,
    status = 'unchecked',
  }: {
    label: string
    status?: TaskItemStatus
  }) {
    return {
      label,
      status,
    }
  }

  get data() {
    return {
      label: this.label,
      status: this.status,
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
