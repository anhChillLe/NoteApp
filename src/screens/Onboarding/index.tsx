import { useNavigation } from '@react-navigation/native'
import React, { FC, useCallback } from 'react'
import { OnboardingLayout } from '~/components/templates'

export const OnboardingScreen: FC = () => {
  const navigation = useNavigation()

  const handleStart = useCallback(() => {
    navigation.navigate('tag_init')
  }, [])

  return <OnboardingLayout onStart={handleStart} onSkip={handleStart} />
}
