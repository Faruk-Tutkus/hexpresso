import { useAuth } from '@providers';
import React from 'react';
import { Text, View } from 'react-native';

const Home = () => {
  const user = useAuth();
  console.log(user);
  return (
    <View>
      <Text>index</Text>
    </View>
  )
}

export default Home;