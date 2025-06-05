import { StyleSheet } from "react-native";
export default StyleSheet.create({
  container: {
    padding: 10,
    overflow: 'hidden',
    borderRadius: 8,
    width: 100,
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
  disabled: {
    opacity: 0.6,
  },
});