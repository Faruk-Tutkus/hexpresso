import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // Loading Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontFamily: 'Domine-Regular',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  // Section Styles
  signsSection: {
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  commentsSection: {
    paddingHorizontal: 20,
  },
  aiSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontFamily: 'Almendra-Regular',
    fontSize: 24,
    marginBottom: 15,
    paddingHorizontal: 20,
  },

  // Zodiac Signs Horizontal List Styles
  signsListContainer: {
    paddingHorizontal: 10,
  },
  signCard: {
    width: 115,
    height: 120,
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  signCardImage: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  signCardText: {
    fontFamily: 'Domine-Regular',
    fontSize: 12,
    textAlign: 'center',
  },

  // Comment Card Styles
  commentCard: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  commentCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    minHeight: 80,
  },
  commentCardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    flex: 1,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentCardTitle: {
    fontFamily: 'Almendra-Regular',
    fontSize: 18,
    marginBottom: 4,
  },
  commentCardDate: {
    fontFamily: 'Domine-Regular',
    fontSize: 14,
  },
  commentCardContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  commentText: {
    fontFamily: 'Domine-Regular',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },

  // Daily Navigation Styles
  dailyNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  dailyNavButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 5,
  },
  dailyNavText: {
    fontFamily: 'Domine-Regular',
    fontSize: 14,
  },
  todayIndicator: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  todayText: {
    fontFamily: 'Almendra-Regular',
    fontSize: 16,
  },

  // Stars Rating Styles
  starsContainer: {
    marginVertical: 15,
  },
  starsTitle: {
    fontFamily: 'Almendra-Regular',
    fontSize: 16,
    marginBottom: 10,
  },
  starsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  starItem: {
    alignItems: 'center',
    flex: 1,
  },
  starLabel: {
    fontFamily: 'Domine-Regular',
    fontSize: 12,
    marginBottom: 5,
  },
  starValue: {
    fontFamily: 'Almendra-Regular',
    fontSize: 16,
  },

  // Matches Styles
  matchesContainer: {
    marginVertical: 15,
  },
  matchesTitle: {
    fontFamily: 'Almendra-Regular',
    fontSize: 16,
    marginBottom: 10,
  },
  matchesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  matchItem: {
    alignItems: 'center',
    flex: 1,
  },
  matchLabel: {
    fontFamily: 'Domine-Regular',
    fontSize: 12,
    marginBottom: 5,
  },
  matchValue: {
    fontFamily: 'Almendra-Regular',
    fontSize: 14,
  },
})

export default styles
