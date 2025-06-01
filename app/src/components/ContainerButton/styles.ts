import { StyleSheet } from "react-native";
export default StyleSheet.create({
    container: {
      padding: 10,
      borderRadius: 8,
      width: '80%',
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
    },
    text: {
      fontSize: 16,
      fontWeight: '600',
    },
    disabled: {
      opacity: 0.6,
    },
    image: {
      width: 24,
      height: 24,
    },
  });