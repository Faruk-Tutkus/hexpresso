import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  topSpacer: {
    height: height * 0.08, // StatusBar için boşluk
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Header Section
  headerSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.8,
  },
  
  // Animation Section
  animationSection: {
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hexBackground: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hexShape: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hexInner: {
    width: 100,
    height: 100,
    borderWidth: 3,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(140, 82, 255, 0.1)',
    shadowColor: '#8C52FF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  hexSymbol: {
    fontSize: 30,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  
  // Description Section
  descriptionSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.7,
  },
  
  // Button Section
  buttonSection: {
    paddingBottom: 30,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  primaryButton: {
    width: width * 0.75,
    height: 50,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(140, 82, 255, 0.5)',
    backgroundColor: 'rgba(140, 82, 255, 0.1)',
    shadowColor: '#8C52FF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  secondaryButton: {
    width: width * 0.75,
    height: 50,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(226, 54, 66, 0.5)',
    backgroundColor: 'rgba(226, 54, 66, 0.1)',
    shadowColor: '#E23642',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  termsContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  termsText: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
    opacity: 0.6,
  },
  termsLink: {
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
});