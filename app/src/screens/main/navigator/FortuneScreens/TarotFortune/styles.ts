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
  
  // Loading and Error States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Domine-Medium',
    textAlign: 'center',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Domine-Medium',
    textAlign: 'center',
  },
  
  // Instructions Section
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
  
  // Selected Cards Section
  selectedSection: {
    marginBottom: 24,
  },
  selectedHeader: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 16,
  },
  selectedTitle: {
    fontSize: 18,
    fontFamily: 'Domine-Bold',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 8,
  },
  resetText: {
    fontSize: 12,
    fontFamily: 'Domine-Medium',
    marginLeft: 4,
  },
  selectedCardsScroll: {
    paddingVertical: 8,
  },
  selectedCardsList: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  selectedCardContainer: {
    width: 120,
    marginRight: 12,
    borderRadius: 12,
    borderWidth: 2,
    padding: 8,
    position: 'relative',
  },
  removeCardButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    zIndex: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  selectedCard: {
    width: '100%',
    aspectRatio: 0.7,
    borderRadius: 8,
    marginBottom: 8,
  },
  cardBack: {
    width: '100%',
    aspectRatio: 0.7,
    borderRadius: 8,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  cardBackPattern: {
    width: '80%',
    height: '80%',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  cardBackText: {
    fontSize: 24,
    marginBottom: 4,
  },
  cardBackSubtext: {
    fontSize: 10,
    fontFamily: 'Domine-Bold',
    letterSpacing: 2,
  },
  selectedCardInfo: {
    alignItems: 'center',
  },
  cardPosition: {
    fontSize: 12,
    fontFamily: 'Domine-Bold',
    marginBottom: 2,
  },
  cardMeaning: {
    fontSize: 10,
    fontFamily: 'Domine-Medium',
    textAlign: 'center',
    marginBottom: 2,
    lineHeight: 14,
  },
  cardName: {
    fontSize: 9,
    fontFamily: 'Domine-Regular',
    textAlign: 'center',
    lineHeight: 12,
  },
  
  // Available Cards Section
  cardsSection: {
    marginBottom: 32,
  },
  cardsTitle: {
    fontSize: 18,
    fontFamily: 'Domine-Bold',
    marginBottom: 8,
  },
  cardsSubtitle: {
    fontSize: 14,
    fontFamily: 'Domine-Regular',
    marginBottom: 16,
    lineHeight: 20,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  availableCard: {
    width: 100,
    aspectRatio: 0.65,
    marginRight: 12,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  availableCardImage: {
    width: '100%',
    height: '100%',
  },
  availableCardBack: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
  },
  availableCardBackPattern: {
    width: '75%',
    height: '75%',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  availableCardBackText: {
    fontSize: 16,
  },
  
  // Submit Section
  submitSection: {
    marginBottom: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    borderRadius: 16,
    paddingVertical: 16,
    width: '90%',
  },
  // FlatList content container
  cardsList: {
    paddingHorizontal: 8,
  },
}); 