import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    headerContainer: {
        alignItems: 'center',
        paddingVertical: 30,
        paddingHorizontal: 40,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontFamily: 'Domine-Bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Domine-Regular',
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 22,
    },
    divider: {
        width: 60,
        height: 3,
        borderRadius: 2,
        marginTop: 8,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    separator: {
        height: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    loadingAnimation: {
        width: 120,
        height: 120,
        marginBottom: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingIcon: {
        fontSize: 50,
        textAlign: 'center',
    },
    loadingIndicator: {
        marginVertical: 16,
    },
    loadingText: {
        fontSize: 16,
        fontFamily: 'Domine-Medium',
        textAlign: 'center',
        marginTop: 8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingVertical: 40,
    },
    emptyAnimation: {
        width: 140,
        height: 140,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyIcon: {
        fontSize: 60,
        textAlign: 'center',
    },
    emptyText: {
        fontSize: 18,
        fontFamily: 'Domine-SemiBold',
        textAlign: 'center',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        fontFamily: 'Domine-Regular',
        textAlign: 'center',
        lineHeight: 20,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingVertical: 40,
    },
    errorText: {
        fontSize: 16,
        fontFamily: 'Domine-Medium',
        textAlign: 'center',
        lineHeight: 22,
    },
});
