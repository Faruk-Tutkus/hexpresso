import { Banner, Rewarded } from '@ads';
import React from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const Coins = () => {
  return (
    <View>
      <ScrollView>
      <Banner adType='banner' />
      <Rewarded rewardedType='high' />
      <Rewarded rewardedType='medium' />
      <Rewarded rewardedType='low' />
      <Banner adType='interstitial' />
      </ScrollView>
    </View>
  )
}

export default Coins;