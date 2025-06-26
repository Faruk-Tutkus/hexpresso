import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // Main card container
  card: {
    borderRadius: 20,
    marginVertical: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },

  // Card header section
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
  },

  // Profile section
  profileSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  profileImageContainer: {
    position: 'relative',
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    marginRight: 16,
    overflow: 'hidden',
  },

  profileImageContainerExpanded: {
    position: 'relative',
    width: 100,
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    marginRight: 16,
    overflow: 'hidden',
  },

  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
  },

  profileImageExpanded: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },

  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },

  seerName: {
    fontSize: 20,
    fontFamily: 'Domine-Bold',
    marginBottom: 4,
  },

  seerInfo: {
    fontSize: 14,
    fontFamily: 'Domine-Regular',
    lineHeight: 20,
    marginBottom: 8,
  },

  seerInfoExpanded: {
    fontSize: 15,
    fontFamily: 'Domine-Regular',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 12,
    marginTop: 8,
  },

  responseTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  responseTimeIcon: {
    marginRight: 6,
  },

  responseTime: {
    fontSize: 12,
    fontFamily: 'Domine-Medium',
  },

  // Expand button
  expandButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },

  expandButtonExpanded: {
    position: 'absolute',
    top: 0,
    right: 0,
    marginLeft: 0,
  },

  expandIcon: {
    fontSize: 16,
  },

  // Expanded content
  expandedContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  divider: {
    height: 1,  
    marginBottom: 20,
    opacity: 0.5,
  },

  // Sections
  section: {
    marginBottom: 20,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Domine-Bold',
    marginLeft: 8,
  },

  // Character description
  characterText: {
    fontSize: 15,
    fontFamily: 'Domine-SemiBold',
    lineHeight: 22,
    fontStyle: 'italic',
  },

  // Life story
  lifestoryText: {
    fontSize: 14,
    fontFamily: 'Domine-Regular',
    lineHeight: 22,
    textAlign: 'justify',
  },

  // Note container
  noteContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  quoteIcon: {
    marginRight: 8,
    marginTop: 2,
  },

  noteText: {
    fontSize: 14,
    fontFamily: 'Almendra-Regular',
    fontStyle: 'italic',
    lineHeight: 20,
    flex: 1,
  },

  // Experience grid
  experienceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },

  experienceItem: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 4,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  experienceText: {
    fontSize: 13,
    fontFamily: 'Domine-Medium',
    marginLeft: 8,
  },

  // Fortune selection
  fortuneGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    justifyContent: 'space-between',
  },

  fortuneButton: {
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    minWidth: '45%',
    margin: 4,
    borderWidth: 1,
  },

  fortuneButtonContent: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 60,
    paddingVertical: 4,
  },

  fortuneInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  fortuneButtonText: {
    fontSize: 13,
    fontFamily: 'Domine-SemiBold',
    textAlign: 'center',
    marginLeft: 6,
    flexShrink: 1,
  },

  coinInfo: {
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

  // Coin selection
  coinGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },

  coinButtonText: {
    fontSize: 15,
    fontFamily: 'Domine-Bold',
    textAlign: 'center',
  },

  // Action section
  actionSection: {
    paddingTop: 20,
    borderTopWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  actionButton: {
    borderRadius: 16,
    paddingVertical: 16,
    marginHorizontal: 0,
  },

  // Legacy styles for backward compatibility
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },

  headerTextContainer: {
    flex: 1,
  },

  name: {
    fontSize: 18,
    fontFamily: 'Domine-Bold',
  },

  info: {
    fontSize: 14,
    fontFamily: 'Domine-Regular',
    marginTop: 2,
  },

  detailsContainer: {
    marginTop: 15,
    borderTopWidth: 1,
    paddingTop: 15,
    paddingHorizontal: 20,
  },

  character: {
    fontSize: 15,
    fontFamily: 'Domine-SemiBold',
    marginBottom: 10,
  },

  lifestory: {
    fontSize: 14,
    fontFamily: 'Domine-Regular',
    marginBottom: 10,
    lineHeight: 20,
  },

  note: {
    fontSize: 14,
    fontFamily: 'Almendra-Regular',
    fontStyle: 'italic',
    marginBottom: 15,
    textAlign: 'center',
  },

  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },

  button: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 4,
    borderWidth: 1,
  },

  buttonText: {
    fontSize: 14,
    fontFamily: 'Domine-Medium',
  },

  actionButtonText: {
    fontSize: 16,
    fontFamily: 'Domine-Bold',
  },

  // Expanded header layout
  expandedHeaderLayout: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },

  expandedProfileInfo: {
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
  },

}); 