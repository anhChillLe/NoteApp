import { BSON } from "realm";
import { Tag, TagData, Timestamped } from "~/services/database/model";

const uuid = () =>  new BSON.UUID()
const initTimestamp: Timestamped = {
  createAt: new Date(),
  updateAt: null
}

export const tags: TagData[] = [
  {
    ...initTimestamp,
    name: 'Work',
    isPinned: false
  },
  {
    ...initTimestamp,
    name: 'Home',
    isPinned: false
  },
  {
    ...initTimestamp,
    name: 'Study',
    isPinned: false
  },
  {
    ...initTimestamp,
    name: 'Hoby',
    isPinned: false
  },
]