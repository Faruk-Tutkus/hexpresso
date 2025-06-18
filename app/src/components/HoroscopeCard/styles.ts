import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    marginHorizontal: "auto",
    marginVertical: 10,
    borderRadius: 10,
    padding: 10,
  },
  left: {
    flexDirection: "column",
    alignItems: "center",
    width: "70%",
    padding: 10,
    gap: 10,
  },
  sign: {
    fontFamily: 'Almendra-Regular',
    textAlign: "center",
    fontSize: 28,
  },
  date: {
    fontFamily: 'Domine-Regular',
    fontSize: 15,
    textAlign: "center",
  },
  right: {
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 100,
    height: 80,
  },
  loadingContainer: {
    width: 100,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;