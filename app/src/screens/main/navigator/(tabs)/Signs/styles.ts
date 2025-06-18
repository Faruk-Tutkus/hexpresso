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
  loadingImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  loadingIndicator: {
    marginVertical: 20,
  },
  loadingText: {
    fontFamily: 'Domine-Regular',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 20,
  },
  signImage: {
    width: 120,
    height: 120,
    marginBottom: 15,
  },
  signName: {
    fontFamily: 'Almendra-Regular',
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 5,
  },
  signDates: {
    fontFamily: 'Domine-Regular',
    fontSize: 18,
    textAlign: 'center',
  },
  infoCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  cardTitle: {
    fontFamily: 'Almendra-Regular',
    fontSize: 18,
  },
  cardContent: {
    fontFamily: 'Domine-Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  twoColumnContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  halfCard: {
    flex: 1,
    borderRadius: 15,
    padding: 15,
  },
  smallCardTitle: {
    fontFamily: 'Almendra-Regular',
    fontSize: 14,
  },
  smallCardContent: {
    fontFamily: 'Domine-Regular',
    fontSize: 13,
    lineHeight: 18,
  },
  gridCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    padding: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 5,
  },
  gridItemText: {
    fontFamily: 'Domine-Regular',
    fontSize: 14,
    textAlign: 'left',
  },
  careerCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    padding: 20,
  },
  careerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  careerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 25,
    gap: 8,
    marginBottom: 5,
  },
  careerText: {
    fontFamily: 'Domine-Regular',
    fontSize: 14,
  },
  famousCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    padding: 20,
  },
  famousGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  famousItem: {
    alignItems: 'center',
    width: '45%',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  famousAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  famousInitial: {
    fontFamily: 'Almendra-Regular',
    fontSize: 18,
  },
  famousName: {
    fontFamily: 'Domine-Regular',
    fontSize: 12,
    textAlign: 'center',
  },
  moreText: {
    fontFamily: 'Domine-Regular',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '95%',
    maxHeight: '85%',
    borderRadius: 20,
    padding: 0,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    flex: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    flexShrink: 0,
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  modalTitle: {
    fontFamily: 'Almendra-Regular',
    fontSize: 20,
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    padding: 20,
    maxHeight: 400,
  },
  modalText: {
    fontFamily: 'Domine-Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  // Modal List Styles
  modalList: {
    gap: 5,
  },
  modalListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    gap: 15,
  },
  modalListBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  modalListText: {
    fontFamily: 'Domine-Regular',
    fontSize: 16,
    lineHeight: 22,
    flex: 1,
  },
  // Modal Career Styles
  modalCareerList: {
    gap: 10,
  },
  modalCareerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    gap: 12,
  },
  modalCareerText: {
    fontFamily: 'Domine-Regular',
    fontSize: 16,
    flex: 1,
  },
  // Modal Famous Styles
  modalFamousList: {
    gap: 12,
  },
  modalFamousItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    gap: 15,
  },
  modalFamousAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalFamousInitial: {
    fontFamily: 'Almendra-Regular',
    fontSize: 16,
  },
  modalFamousText: {
    fontFamily: 'Domine-Regular',
    fontSize: 16,
    flex: 1,
  },
})

export default styles