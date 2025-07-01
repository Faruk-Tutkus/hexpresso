import { StyleSheet } from "react-native";
export default StyleSheet.create({
    container: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      minWidth: '80%',
      borderRadius: 8,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      fontSize: 16,
      fontWeight: '600',
      marginHorizontal: 8,
      textAlign: 'center',
    },
    disabled: {
      opacity: 0.6,
    },
    imageContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 4,
    },
    image: {
      width: 24,
      height: 24,
    },
  });