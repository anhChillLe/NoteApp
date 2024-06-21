import { ComponentType, FC } from 'react'
import { BSON } from 'realm'
import { useObject, useQuery } from '~/services/database'
import { Note, Tag } from '~/services/database/model'

function createTagItemWithCount<P extends { count?: number }>(
  Wrapped: ComponentType<P>,
) {
  const Component: FC<P & { tagId: string }> = ({ tagId, ...props }) => {
    const tag = useObject({ type: Tag, primaryKey: new BSON.UUID(tagId) })

    const notes = useQuery(
      {
        type: Note,
        query: collection => collection.filtered('$0 IN tags', tag),
      },
      [tag],
    )

    return <Wrapped count={notes.length} {...(props as any)} />
  }

  return Component
}

export { createTagItemWithCount }
