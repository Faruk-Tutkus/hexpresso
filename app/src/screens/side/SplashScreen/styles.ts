import { StyleSheet } from 'react-native';
import { Colors } from '@constants';
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.light.background,
    },
    loading: {
      width: 350,
      height: 350,
      marginLeft: 25,
    }
});

export default styles;