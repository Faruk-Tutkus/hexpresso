import { AskAI } from '@components';
import { useAuth } from '@providers';
import React from 'react';
import { View } from 'react-native';
const Home = () => {
  const user = useAuth();

  return (
    <View>
      <AskAI />
    </View>
  )
}

export default Home;