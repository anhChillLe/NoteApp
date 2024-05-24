import { useNavigation } from '@react-navigation/native'
import { FC } from 'react'
import { SettingLayout } from '~/components/templates'

export const SettingScreen: FC = () => {
  const navigation = useNavigation()

  return <SettingLayout onBackPress={navigation.goBack} />
}
