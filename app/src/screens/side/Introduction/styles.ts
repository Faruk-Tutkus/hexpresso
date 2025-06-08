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
        minHeight: 400,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        textAlign: 'center',
        paddingHorizontal: 20,
        fontFamily: 'CroissantOne-Regular',
        fontSize: 36,
    },
    description: {
        fontFamily: 'Domine-Regular',
        alignContent: 'center',
        textAlign: 'center',
        paddingHorizontal: 20,
        marginVertical: 15,
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '80%',
        marginTop: 15,
        justifyContent: 'space-between',
    },
})

export default styles