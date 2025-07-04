import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 40,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Domine-Bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Domine-Regular',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  divider: {
    width: 60,
    height: 3,
    borderRadius: 2,
    marginTop: 8,
  },
  listContent: {
    marginHorizontal: 20,
    paddingBottom: 20,
  },
  separator: {
    height: 12,
  },
  fortuneCard: {
    borderRadius: 16,
    padding: 16,
    marginVertical: 6,
    borderWidth: 1,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  seerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 2,
  },
  cardHeaderText: {
    flex: 1,
  },
  seerName: {
    fontSize: 16,
    fontFamily: 'Domine-Bold',
    marginBottom: 2,
  },
  fortuneType: {
    fontSize: 14,
    fontFamily: 'Domine-Medium',
    marginBottom: 2,
  },
  createdDate: {
    fontSize: 12,
    fontFamily: 'Domine-Regular',
  },
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  coinText: {
    fontSize: 12,
    fontFamily: 'Domine-Bold',
    marginLeft: 4,
  },
  statusContainer: {
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Domine-Medium',
    textAlign: 'center',
  },
  resultButton: {
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  resultButtonText: {
    fontSize: 16,
    fontFamily: 'Domine-Bold',
  },
  
  // Result Section Styles
  resultContainer: {
    marginTop: 16,
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 18,
    fontFamily: 'Domine-Bold',
    marginLeft: 8,
  },
  resultDivider: {
    height: 2,
    marginBottom: 16,
    borderRadius: 1,
  },
  
  // Interpretation Section
  interpretationSection: {
    marginBottom: 16,
  },
  sectionIcon: {
    marginBottom: 8,
    alignItems: 'center',
  },
  interpretationText: {
    fontSize: 14,
    fontFamily: 'Domine-Regular',
    lineHeight: 24,
    textAlign: 'justify',
  },
  
  // Section Headers and Content
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 14,
    fontFamily: 'Domine-Bold',
    marginLeft: 6,
  },
  sectionText: {
    fontSize: 12,
    fontFamily: 'Domine-Regular',
    lineHeight: 20,
    textAlign: 'justify',
  },
  
  // Individual Sections
  adviceSection: {
    marginBottom: 16,
  },
  timeframeSection: {
    marginBottom: 16,
  },
  warningSection: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  positiveSection: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  
  // Fortune Signature
  fortuneSignature: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  signatureText: {
    fontSize: 12,
    fontFamily: 'Almendra-Regular',
    fontStyle: 'italic',
  },
  
  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  emptyAnimation: {
    width: 140,
    height: 140,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 60,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Domine-SemiBold',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Domine-Regular',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Scrollable Header Styles
  scrollableHeader: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Domine-Bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Domine-Regular',
    textAlign: 'center',
    opacity: 0.8,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerDivider: {
    height: 1,
    marginHorizontal: -20,
    opacity: 0.3,
  },
  // Enhanced Status Badge Styles
  statusBadge: {
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusIcon: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusMessage: {
    fontSize: 14,
    fontFamily: 'Domine-SemiBold',
    lineHeight: 20,
    flex: 1,
  },
  countdownBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 12,
  },
  countdownText: {
    fontSize: 12,
    fontFamily: 'Domine-Bold',
  },
  // Enhanced Result Button Styles
  enhancedResultButton: {
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  resultButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  resultIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resultButtonTextContainer: {
    flex: 1,
  },
  resultButtonTitle: {
    fontSize: 16,
    fontFamily: 'Domine-Bold',
    marginBottom: 2,
  },
  resultButtonSubtitle: {
    fontSize: 12,
    fontFamily: 'Domine-Regular',
    
  },
  chevronContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },

  // Input Section Styles
  inputContainer: {
    marginTop: 16,
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  inputTitle: {
    fontSize: 18,
    fontFamily: 'Domine-Bold',
    marginLeft: 8,
  },
  inputDivider: {
    height: 2,
    marginBottom: 16,
    borderRadius: 1,
  },
  
  // Input Section Headers
  inputSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  inputSectionLabel: {
    fontSize: 14,
    fontFamily: 'Domine-Bold',
    marginLeft: 6,
  },

  // Coffee Images Styles
  coffeeInputSection: {
    marginBottom: 16,
  },
  coffeeImagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  coffeeImageItem: {
    width: '48%',
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  coffeeImage: {
    width: '100%',
    aspectRatio: 1,
  },
  coffeeImageLabel: {
    fontSize: 12,
    fontFamily: 'Domine-Medium',
    textAlign: 'center',
    paddingVertical: 8,
  },

  // Hand Images Styles
  handInputSection: {
    marginBottom: 16,
  },
  handImagesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  handImageItem: {
    width: '48%',
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  handImage: {
    width: '100%',
    aspectRatio: 0.8,
  },
  handImageLabel: {
    fontSize: 12,
    fontFamily: 'Domine-Medium',
    textAlign: 'center',
    paddingVertical: 8,
  },

  // Dream Text Styles
  dreamInputSection: {
    marginBottom: 16,
  },
  dreamTextContainer: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    marginBottom: 8,
  },
  dreamText: {
    fontSize: 12,
    fontFamily: 'Domine-Regular',
    lineHeight: 20,
    textAlign: 'justify',
  },
  dreamStats: {
    alignItems: 'flex-end',
  },
  dreamStatsText: {
    fontSize: 12,
    fontFamily: 'Domine-Medium',
  },
});