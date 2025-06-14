import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingVertical: 16,
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignContent: 'center',
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderBottomWidth: 1,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    answerContainer: {
        width: '90%',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        marginTop: 8,
        paddingVertical: 16,
        paddingHorizontal: 24,
        justifyContent: 'flex-start',
    },
    answerText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default styles;