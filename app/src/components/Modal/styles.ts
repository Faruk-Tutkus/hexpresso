import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: 20,
  },
  modalContent: {
    borderRadius: 16,
    padding: 25,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center' as const,
  },
  modalIcon: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Domine-Bold',
    textAlign: 'center' as const,
    marginBottom: 15,
  },
  modalDescription: {
    fontSize: 16,
    fontFamily: 'Domine-Regular',
    textAlign: 'center' as const,
    lineHeight: 24,
    marginBottom: 25,
  },
  modalButtons: {
    justifyContent: 'center',
    gap: 15,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    minHeight: 48,
  },
  cancelButton: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  confirmButton: {
    borderWidth: 0,
  },
  modalButtonText: {
    fontSize: 16,
    fontFamily: 'Domine-SemiBold',
    textAlign: 'center' as const,
  },
  // Photo picker modal styles
  photoPickerButtons: {
    flexDirection: 'row' as const,
    gap: 15,
    width: '100%',
    marginBottom: 20,
  },
  photoPickerOption: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  photoPickerText: {
    fontSize: 16,
    fontFamily: 'Domine-SemiBold',
    textAlign: 'center' as const,
  },
  cancelOptionButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  cancelOptionText: {
    fontSize: 16,
    fontFamily: 'Domine-Medium',
    textAlign: 'center' as const,
  },

})

export default styles;