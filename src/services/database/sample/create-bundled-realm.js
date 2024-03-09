import Realm from 'realm'
import { realmConfig } from '~/services/database'
import { Tag } from '~/services/database/model'
import { tags } from './bundle.data'

const realm = await Realm.open(realmConfig)

// Write tags
realm.write(() => {
  const id = () => new Realm.BSON.UUID()
  tags.forEach(tag => {
    realm.create(Tag.name, {
      id: id(),
      ...tag
    })
  })
})

realm.close()