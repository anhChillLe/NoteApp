import { useNavigation } from '@react-navigation/native'
import { FC } from 'react'
import { CreatePasswordLayout } from '~/components/templates'
import createScreenWithVerify from '../WithVerify'
import usePrivate from '../store'

const ChangePasswordScreen: FC = () => {
  const navigation = useNavigation()
  const changePassword = usePrivate(state => state.changePassword)

  return (
    <CreatePasswordLayout
      title="Change password"
      onBackPress={navigation.goBack}
      onSubmit={changePassword}
    />
  )
}

const ChangePasswordScreenWithVerify = createScreenWithVerify(
  'set_password',
  ChangePasswordScreen,
)

export default ChangePasswordScreenWithVerify
