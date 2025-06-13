import { Header } from '@components'
import { useAuth } from '@providers'
import { UserCredential } from 'firebase/auth'
import React from 'react'
import { View } from 'react-native'

const GuideScreen = () => {
  const user = useAuth();
  return (
    <View>
      <Header user={user as UserCredential} />
    </View>
  )
}

export default GuideScreen