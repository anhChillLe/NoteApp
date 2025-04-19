import { StaticScreenProps, useNavigation } from '@react-navigation/native'
import { FC } from 'react'
import OnboardingScreenLayout from './Layout'

type Props = StaticScreenProps<undefined>
const OnboardingScreen: FC<Props> = () => {
  const navigation = useNavigation()

  const handleStart = () => {
    navigation.navigate('tag_init')
  }

  return <OnboardingScreenLayout onStart={handleStart} onSkip={handleStart} />
}

export default OnboardingScreen
