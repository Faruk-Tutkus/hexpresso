import { Colors } from '@constants';
import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },
  socialMediaContainer: {
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },
})

export default styles;
