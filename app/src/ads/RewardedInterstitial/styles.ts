import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 2,
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 16,
  },
  content: {
    alignItems: 'center',
  }, 
  rewardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  coinImage: {
    width: 70,
    height: 70,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  rewardTitle: {
    fontFamily: 'Almendra-Regular',
    fontSize: 20,
    marginBottom: 4,
  },
  rewardAmount: {
    fontFamily: 'Domine-Bold',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  rewardDescription: {
    fontFamily: 'Domine-Regular',
    fontSize: 14,
    lineHeight: 18,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '85%',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  loadingText: {
    fontFamily: 'Domine-Regular',
    fontSize: 14,
    marginTop: 8,
  },
})

export default styles 