import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    gap: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 10,
  },
  headerTitle: {
    fontFamily: 'Almendra-Regular',
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 10,
  },
  headerSubtitle: {
    fontFamily: 'Domine-Regular',
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
  coinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    gap: 8,
  },
  coinImage: {
    width: 24,
    height: 24,
  },
  coinBalance: {
    fontFamily: 'Domine-Bold',
    fontSize: 20,
  },
  
  // Task Cards
  taskCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 15,
  },
  taskIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontFamily: 'Almendra-Regular',
    fontSize: 18,
    marginBottom: 4,
  },
  taskDescription: {
    fontFamily: 'Domine-Regular',
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 18,
  },
  taskReward: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  rewardText: {
    fontFamily: 'Domine-Bold',
    fontSize: 16,
  },
  rewardCoin: {
    width: 18,
    height: 18,
  },
  
  // Task Actions
  taskActions: {
    marginTop: 15,
    gap: 10,
    flexDirection: 'row',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    fontFamily: 'Domine-SemiBold',
    fontSize: 14,
  },
  completedButton: {
    opacity: 0.6,
  },
  completedText: {
    fontFamily: 'Domine-Regular',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
    opacity: 0.6,
  },
  
  // Social Media Cards
  socialCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
  },
  socialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 12,
  },
  socialIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  socialInfo: {
    flex: 1,
  },
  socialTitle: {
    fontFamily: 'Almendra-Regular',
    fontSize: 16,
    marginBottom: 2,
  },
  socialSubtitle: {
    fontFamily: 'Domine-Regular',
    fontSize: 12,
    opacity: 0.7,
  },
  
  // Referral Card
  referralCard: {
    borderRadius: 20,
    padding: 25,
    marginBottom: 15,
    alignItems: 'center',
  },
  referralTitle: {
    fontFamily: 'Almendra-Regular',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
  },
  referralDescription: {
    fontFamily: 'Domine-Regular',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.8,
    lineHeight: 20,
  },
  referralCodeContainer: {
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
    minWidth: 200,
    alignItems: 'center',
  },
  referralCode: {
    fontFamily: 'Domine-Bold',
    fontSize: 20,
    letterSpacing: 3,
  },
  referralActions: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  referralButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  
  // Progress Indicator
  progressContainer: {
    marginTop: 10,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressText: {
    fontFamily: 'Domine-Regular',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
    opacity: 0.7,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  
  // Instructions Modal
  instructionModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  instructionContent: {
    width: '95%',
    maxHeight: '80%',
    borderRadius: 20,
    padding: 25,
  },
  instructionTitle: {
    fontFamily: 'Almendra-Regular',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  instructionStep: {
    flexDirection: 'row',
    marginBottom: 15,
    gap: 15,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontFamily: 'Domine-Bold',
    fontSize: 14,
  },
  stepText: {
    flex: 1,
    fontFamily: 'Domine-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  instructionImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginVertical: 15,
  },
  closeInstructionButton: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
});
