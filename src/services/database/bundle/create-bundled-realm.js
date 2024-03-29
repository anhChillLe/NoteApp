import Realm from 'realm'

class Tag extends Realm.Object {
  static properties = {
    _id: 'uuid',
    name: { type: 'string', indexed: 'full-text' },
    isPinned: 'bool',
    createAt: 'date',
    updateAt: 'date',
  }

  static schema = {
    name: 'Tag',
    primaryKey: '_id',
    properties: this.properties,
  }
}

class Note extends Realm.Object {
  static properties = {
    _id: 'uuid',
    title: { type: 'string', indexed: 'full-text' },
    content: { type: 'string', indexed: 'full-text' },
    importantLevel: 'string',
    createAt: 'date',
    updateAt: 'date',
    tag: 'Tag?',
    style: 'Style?',
  }

  static schema = {
    name: 'Note',
    primaryKey: '_id',
    properties: this.properties,
  }
}

class Style extends Realm.Object {
  static properties = {
    _id: 'uuid',
    background: 'string',
    onBackground: 'string',
    createAt: 'date',
    updateAt: 'date',
  }

  static schema = {
    name: 'Style',
    primaryKey: '_id',
    properties: this.properties,
  }
}

export class TaskItem extends Realm.Object {
  static properties = {
    title: { type: 'string', indexed: 'full-text' },
    isSelected: 'bool',
    createAt: 'date',
    updateAt: 'date',
  }

  static schema = {
    name: 'TaskItem',
    embedded: true,
    properties: this.properties,
  }
}

class Task extends Realm.Object {
  static properties = {
    _id: 'uuid',
    title: { type: 'string', indexed: 'full-text' },
    items: 'TaskItem[]',
    createAt: 'date',
    updateAt: 'date',
  }

  static schema = {
    name: 'Task',
    primaryKey: '_id',
    properties: this.properties,
  }
}

const realmConfig = {
  schema: [Tag, Note, Style, Task, TaskItem],
  path: 'bundle.realm',
}

const realm = await Realm.open(realmConfig)

const initTimestamp = {
  createAt: new Date(),
  updateAt: new Date(),
}

function withTimeStamp(data) {
  return data.map(it => ({ ...initTimestamp, ...it }))
}
function withId(data) {
  return data.map(it => ({ _id: new Realm.BSON.UUID(), ...it }))
}

const decoration = data => withTimeStamp(withId(data))

const tagData = [
  {
    name: 'Work',
    isPinned: false,
  },
  {
    name: 'Home',
    isPinned: false,
  },
  {
    name: 'Study',
    isPinned: false,
  },
  {
    name: 'Hoby',
    isPinned: false,
  },
]

const noteData = [
  {
    title: 'Note title',
    content: 'This not content',
    importantLevel: 'default',
    tag: null,
    style: null,
  },
  {
    title: 'Note title',
    content: 'This not content',
    importantLevel: 'default',
    tag: null,
    style: null,
  },
  {
    title: 'Note title',
    content: 'This not content',
    importantLevel: 'default',
    tag: null,
    style: null,
  },
  {
    title: 'Note title',
    content: 'This not content',
    importantLevel: 'default',
    tag: null,
    style: null,
  },
]

const styleData = [
  {
    background: '#FFFFFF',
    onBackground: '#000000',
  },
  {
    background: '#FFFFFF',
    onBackground: '#000000',
  },
  {
    background: '#FFFFFF',
    onBackground: '#000000',
  },
  {
    background: '#FFFFFF',
    onBackground: '#000000',
  },
]

const taskItemData = [
  {
    title: 'Task item title',
    isSelected: false,
  },
  {
    title: 'Task item title',
    isSelected: false,
  },
  {
    title: 'Task item title',
    isSelected: false,
  },
  {
    title: 'Task item title',
    isSelected: false,
  },
]

const taskData = [
  {
    title: 'Task title',
    items: withTimeStamp(taskItemData),
  },
  {
    title: 'Task title',
    items: withTimeStamp(taskItemData),
  },
  {
    title: 'Task title',
    items: withTimeStamp(taskItemData),
  },
  {
    title: 'Task title',
    items: withTimeStamp(taskItemData),
  },
]

const tags = decoration(tagData)
const notes = decoration(noteData)
const styles = decoration(styleData)
const tasks = decoration(taskData)

// Write tags
realm.write(() => {
  tags.forEach(tag => {
    realm.create('Tag', tag)
  })
  notes.forEach(note => {
    realm.create('Note', note)
  })
  styles.forEach(style => {
    realm.create('Style', style)
  })
  tasks.forEach(task => {
    realm.create('Task', task)
  })
})

realm.close()
