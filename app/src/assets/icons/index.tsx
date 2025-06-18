import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface IconProps {
    name: string;
    size?: number;
    color?: string;
    zodiac?: boolean;
}

const Icon = ({ name, size, color, zodiac }: IconProps) => {
  if (zodiac) {
    return (
      <MaterialCommunityIcons name={name as keyof typeof MaterialCommunityIcons.glyphMap} size={size} color={color} />
    )
  }
  return (
    <Ionicons name={name as keyof typeof Ionicons.glyphMap} size={size} color={color} />
  )
}

export default Icon