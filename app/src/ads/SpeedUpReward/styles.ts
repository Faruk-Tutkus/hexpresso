import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 8,
    overflow: 'hidden',
  },
  content: {
    padding: 12,
  },
  speedUpInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  speedUpTitle: {
    fontSize: 16,
    fontFamily: 'Domine-Bold',
    marginBottom: 2,
  },
  speedUpDescription: {
    fontSize: 12,
    fontFamily: 'Domine-Regular',
    lineHeight: 16,
    marginBottom: 4,
  },
  remainingTime: {
    fontSize: 11,
    fontFamily: 'Domine-SemiBold',
  },
  buttonContainer: {
    alignItems: 'flex-end',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  loadingText: {
    fontSize: 12,
    fontFamily: 'Domine-Medium',
    marginLeft: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
}); 