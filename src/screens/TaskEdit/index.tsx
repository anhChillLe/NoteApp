import { useNavigation } from '@react-navigation/native'
import React, { FC, useCallback, useState } from 'react'
import { BSON } from 'realm'
import { TaskEditLayout, TaskForm } from '~/components/templates'
import { useRootRoute } from '~/navigation/root/hook'
import { useObject, useQuery, useRealm } from '~/services/database'
import { Tag, Task } from '~/services/database/model'

export const TaskEditScreen: FC = () => {
  const route = useRootRoute<'task_edit'>()
  const navigation = useNavigation()
  const realm = useRealm()
  const tags = useQuery(Tag)
  const [id, setId] = useState(new BSON.UUID(route.params?.id))
  const task = useObject(Task, id)

  const handleDataChange = useCallback(
    (data: TaskForm) => {
      if (!data.title && !data.items?.length) return
      realm.write(() => {
        const task = realm.objectForPrimaryKey(Task, id)

        if (task != null) {
          task.update(data)
        } else {
          const { _id } = realm.create(Task, Task.generate(data))
          setId(_id)
        }
      })
    },
    [id],
  )

  return (
    <TaskEditLayout
      tags={tags.map(it => it)}
      task={task}
      onChange={handleDataChange}
      onBackPress={navigation.goBack}
    />
  )
}
