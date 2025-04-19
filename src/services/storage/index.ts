import { MMKV } from 'react-native-mmkv'

const storage = new MMKV()

const encryptionStorage = new MMKV({
  id: 'private',
  encryptionKey: 'chillle',
})

export { encryptionStorage, storage }
