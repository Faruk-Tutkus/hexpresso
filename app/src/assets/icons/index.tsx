import Ionicons from '@expo/vector-icons/Ionicons';

interface IconProps {
    name: keyof typeof Ionicons.glyphMap;
    size?: number;
    color?: string;
}

const Icon = ({ name, size, color }: IconProps) => {
  return (
    <Ionicons name={name as keyof typeof Ionicons.glyphMap} size={size} color={color} />
  )
}

export default Icon