import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: 32,
        paddingHorizontal: 16,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
    },
    leftContainer: {
        flexDirection: 'row',
        gap: 16,
    },
    menuContainer: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleContainer: {
        flexDirection: 'column',
        gap: 4,
    },
    title: {
        fontSize: 20,
        fontFamily: 'Domine-SemiBold',
    },
    message: {
        fontSize: 14,
        fontFamily: 'Domine-Regular',
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    iconText: {
        fontSize: 24,
        fontFamily: 'Domine-SemiBold',
        textAlign: 'center',
    },
    logo: {
        width: 24,
        height: 24,
    },
});

export default styles;