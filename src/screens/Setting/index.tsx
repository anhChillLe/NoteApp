import { StaticScreenProps, useNavigation } from '@react-navigation/native'
import { FC } from 'react'
import SettingScreenLayout from './Layout'

type Props = StaticScreenProps<undefined>
const SettingScreen: FC<Props> = () => {
  const { goBack } = useNavigation()

  return <SettingScreenLayout onBackPress={goBack} />
}

export default SettingScreen
