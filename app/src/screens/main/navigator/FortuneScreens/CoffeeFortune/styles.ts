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
  uploadSection: {
    marginBottom: 32,
  },
  uploadTitle: {
    fontSize: 18,
    fontFamily: 'Domine-Bold',
    marginBottom: 16,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageSlot: {
    width: '48%',
    aspectRatio: 1,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 2,
    overflow: 'hidden',
  },
  imageButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
  },
  placeholderContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 14,
    fontFamily: 'Domine-Medium',
    marginTop: 8,
    textAlign: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'Domine-Medium',
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