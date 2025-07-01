import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleProp, TextStyle } from 'react-native';

interface IconProps {
    name: string;
    size?: number;
    color?: string;
    zodiac?: boolean;
    style?: StyleProp<TextStyle>;
}

const Icon = ({ name, size, color, zodiac, style }: IconProps) => {
  if (zodiac) {
    return (
      <MaterialCommunityIcons name={name as keyof typeof MaterialCommunityIcons.glyphMap} size={size} color={color} style={style} />
    )
  }
  return (
    <Ionicons name={name as keyof typeof Ionicons.glyphMap} size={size} color={color} style={style}/>
  )
}

export default Icon