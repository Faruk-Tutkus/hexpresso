import { Colors } from '@constants';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    chatContainer: {
        flex: 1,
        backgroundColor: Colors.dark.background,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingVertical: 32,
    },
});
