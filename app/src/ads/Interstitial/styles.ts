import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  loadingText: {
    fontFamily: 'Domine-SemiBold',
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
  },
  subText: {
    fontFamily: 'Domine-Regular',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  errorContainer: {
    padding: 20,
  },
  errorText: {
    fontFamily: 'Domine-Bold',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  redirectText: {
    fontFamily: 'Domine-Regular',
    fontSize: 14,
    textAlign: 'center',
  },
})

export default styles 