import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 0,
  },
  toastWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    minHeight: 56,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Domine-SemiBold',
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 2,
  },
  message: {
    fontFamily: 'Domine-Regular',
    fontSize: 14,
    lineHeight: 18,
    opacity: 0.9,
  },
  progressBar: {
    position: 'absolute',
    bottom: 6,
    left: '5%',
    width: '90%',
    height: 3,
    borderRadius: 2,
    marginBottom: 4,
  },
  toastSpacing: {
    marginBottom: 10,
  },
})
