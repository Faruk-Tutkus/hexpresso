import { AskAI } from '@components';
import { useAuth } from '@providers';
import React from 'react';
import { View } from 'react-native';

const GuideScreen = () => {
  const user = useAuth();
  return (
    <View>
      <AskAI type="sign" />
    </View>
  )
}

export default GuideScreen