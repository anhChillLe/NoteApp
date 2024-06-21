import { useNavigation } from '@react-navigation/native'
import React, { FC, useCallback } from 'react'
import { OnboardingScreenLayout } from '~/components/templates'

const OnboardingScreen: FC = () => {
  const navigation = useNavigation()

  const handleStart = useCallback(() => {
    navigation.navigate('tag_init')
  }, [navigation])

  return <OnboardingScreenLayout onStart={handleStart} onSkip={handleStart} />
}

export default OnboardingScreen
