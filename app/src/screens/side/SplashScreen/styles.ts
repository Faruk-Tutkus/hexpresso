import { Colors } from '@constants';
import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.dark.background,
    },
    loading: {
      width: 250,
      height: 250,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      padding: 30,
    }
});

export default styles;