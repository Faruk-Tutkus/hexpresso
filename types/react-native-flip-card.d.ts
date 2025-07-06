declare module 'react-native-flip-card' {
  import * as React from 'react';
    import { Component } from 'react';
    import { ViewStyle } from 'react-native';

  interface FlipCardProps {
    style?: ViewStyle | ViewStyle[];
    flip?: boolean;
    friction?: number;
    perspective?: number;
    clickable?: boolean;
    flipHorizontal?: boolean;
    flipVertical?: boolean;
    onFlipStart?: (isFlipStart: boolean) => void;
    onFlipEnd?: (isFlipEnd: boolean) => void;
    children?: React.ReactNode;
  }

  export default class FlipCard extends Component<FlipCardProps> {}
} 