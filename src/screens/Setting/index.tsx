import { useNavigation } from '@react-navigation/native'
import { FC } from 'react'
import { SettingScreenLayout } from '~/components/templates'

const SettingScreen: FC = () => {
  const { goBack } = useNavigation()

  return <SettingScreenLayout onBackPress={goBack} />
}

export default SettingScreen
