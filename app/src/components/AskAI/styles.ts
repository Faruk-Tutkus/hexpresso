import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        width: '95%', 
        minHeight: 100,
        justifyContent: 'flex-start',
        alignContent: 'center',
        alignSelf: 'center',
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderBottomWidth: 1,
        overflow: 'hidden',
        alignItems: 'center',
        paddingVertical: 30,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 32,
        fontFamily: 'Domine-Bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    headerDescription: {
        fontSize: 16,
        fontFamily: 'Domine-Regular',
        textAlign: 'center',
        marginBottom: 16,
        paddingHorizontal: 32,
        lineHeight: 22,
    },
    divider: {
        width: 60,
        height: 3,
        marginTop: 16,
        marginBottom: 8,
    },
    responseContainer: {
        width: '90%',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        marginTop: 8,
        paddingBottom: 8,
        paddingHorizontal: 18,
        justifyContent: 'flex-start',
    },
    responseText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default styles;