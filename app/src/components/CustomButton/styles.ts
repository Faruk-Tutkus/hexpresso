import { StyleSheet } from "react-native";
export default StyleSheet.create({
    container: {
      padding: 10,
      overflow: 'hidden',
      borderRadius: 8,
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
      gap: 10,
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
      marginLeft: 8,
    },
  });