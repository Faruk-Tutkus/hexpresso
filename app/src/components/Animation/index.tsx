import LottieView from 'lottie-react-native';
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

type AnimationProps = {
    src: string;
    contentStyle?: StyleProp<ViewStyle>;
}

const Animation: React.FC<AnimationProps> = ({
  src,
  contentStyle

}) => {
  return (
  <LottieView
      source={{ uri: src }}
      loop
      autoPlay
      style={[contentStyle]}
    />
  );
}

export default Animation