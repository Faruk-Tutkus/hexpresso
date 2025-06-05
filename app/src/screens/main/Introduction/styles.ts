import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    flatList: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    item: {
        minHeight: 300,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        textAlign: 'center',
        fontFamily: 'CroissantOne-Regular',
        fontSize: 36,
    },
    description: {
        fontFamily: 'Domine-Regular',
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '80%',
        justifyContent: 'space-between',
    },
})

export default styles