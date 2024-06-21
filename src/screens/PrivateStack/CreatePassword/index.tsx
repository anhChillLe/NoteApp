import { useNavigation } from '@react-navigation/native'
import { FC } from 'react'
import { CreatePasswordLayout } from '~/components/templates'
import usePrivate from '../store'

const CreatePasswordScreen: FC = () => {
  const navigation = useNavigation()
  const createPassword = usePrivate(state => state.createPassword)

  return (
    <CreatePasswordLayout
      title="Create password"
      onBackPress={navigation.goBack}
      onSubmit={createPassword}
    />
  )
}

export default CreatePasswordScreen
