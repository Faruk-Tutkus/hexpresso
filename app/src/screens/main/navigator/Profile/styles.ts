import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1, 
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  headerSection: {
    paddingVertical: 25,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'CroissantOne-Regular',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Domine-Regular',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  section: {
    marginBottom: 30,
    backgroundColor: 'transparent',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,

  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'CroissantOne-Regular',
    marginBottom: 20,
    textAlign: 'center',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontFamily: 'Domine-SemiBold',
    marginBottom: 8,
    paddingLeft: 5,
  },
  fieldValue: {
    fontSize: 15,
    fontFamily: 'Domine-Regular',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    backgroundColor: 'rgba(116, 120, 244, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(116, 120, 244, 0.2)',
    minHeight: 48,
  },
  astroGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  astroCard: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    borderWidth: 1,
    borderColor: 'rgba(116, 120, 244, 0.2)',
  },
  astroLabel: {
    fontSize: 12,
    fontFamily: 'Domine-Regular',
    textAlign: 'center',
    marginBottom: 8,
    opacity: 0.8,
  },
  astroValue: {
    fontSize: 14,
    fontFamily: 'Domine-Bold',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  actionSection: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  // Progress Bar styles
  progressContainer: {
    marginBottom: 25,
    backgroundColor: 'transparent',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  progressTitle: {
    fontSize: 16,
    fontFamily: 'Domine-SemiBold',
    flex: 1,
  },
  progressPercentage: {
    fontSize: 20,
    fontFamily: 'CroissantOne-Regular',
    marginLeft: 10,
  },
  progressBarBackground: {
    height: 8,
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
    minWidth: 2,
  },
  progressSubtext: {
    fontSize: 14,
    fontFamily: 'Domine-Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  // Footer styles
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingBottom: 30, // Extra padding for safe area
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  footerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  footerButton: {
    flex: 1,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 16,
    padding: 25,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
  },
  modalIcon: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Domine-Bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  modalDescription: {
    fontSize: 16,
    fontFamily: 'Domine-Regular',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 25,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 15,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  cancelButton: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  allowButton: {
    borderWidth: 0,
  },
  modalButtonText: {
    fontSize: 16,
    fontFamily: 'Domine-SemiBold',
    textAlign: 'center',
  },
});

export default styles;
