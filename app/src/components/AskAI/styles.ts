import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        width: '95%', 
        minHeight: 100,
        paddingVertical: 16,
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignContent: 'center',
        alignSelf: 'center',
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderBottomWidth: 1,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        overflow: 'hidden',
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