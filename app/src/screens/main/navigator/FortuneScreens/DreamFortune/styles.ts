import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  seerInfo: {
    flexDirection: 'row',
    padding: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  seerImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
    borderWidth: 2,
  },
  seerDetails: {
    flex: 1,
  },
  seerName: {
    fontSize: 20,
    fontFamily: 'Domine-Bold',
    marginBottom: 4,
  },
  fortuneType: {
    fontSize: 16,
    fontFamily: 'Domine-SemiBold',
    marginBottom: 4,
  },
  responseTime: {
    fontSize: 14,
    fontFamily: 'Domine-Regular',
  },
  instructions: {
    marginBottom: 24,
  },
  instructionTitle: {
    fontSize: 18,
    fontFamily: 'Domine-Bold',
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 15,
    fontFamily: 'Domine-Regular',
    marginBottom: 12,
    lineHeight: 22,
  },
  instructionList: {
    paddingLeft: 8,
  },
  instructionItem: {
    fontSize: 14,
    fontFamily: 'Domine-Regular',
    marginBottom: 6,
    lineHeight: 20,
  },
  dreamSection: {
    marginBottom: 24,
  },
  dreamTitle: {
    fontSize: 18,
    fontFamily: 'Domine-Bold',
    marginBottom: 16,
  },
  textInputContainer: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    position: 'relative',
  },
  textInput: {
    fontSize: 15,
    fontFamily: 'Domine-Regular',
    lineHeight: 22,
    minHeight: 200,
    textAlignVertical: 'top',
  },
  characterCount: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
  characterCountText: {
    fontSize: 12,
    fontFamily: 'Domine-Medium',
  },
  tipsSection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontFamily: 'Domine-Bold',
    marginLeft: 8,
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'Domine-Regular',
    lineHeight: 20,
  },
  submitSection: {
    marginBottom: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    borderRadius: 16,
    paddingVertical: 16,
  },
}); 