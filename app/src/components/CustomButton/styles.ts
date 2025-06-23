import { StyleSheet } from "react-native";
export default StyleSheet.create({
    container: {
      paddingHorizontal: 10,
      paddingVertical: 10,
      overflow: 'hidden',
      borderRadius: 8,
      width: '50%',
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    },
    disabled: {
      opacity: 0.6,
    },
    leftIcon: {
      marginRight: 8,
    },
    rightIcon: {
      marginRight: 8,
    },
  });