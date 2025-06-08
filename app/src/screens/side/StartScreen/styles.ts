import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  animationContainer: {
    zIndex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: 450,
    height: 450,
  },
  buttonContainer: {
    marginBottom: 100,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 20,
    gap: 15,
  },
  button: {
    width: '85%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: {
    fontSize: 80,
    textAlign: 'center',
  },
  flatList: {
    paddingHorizontal: 10,
    maxHeight: 200,
  },
})