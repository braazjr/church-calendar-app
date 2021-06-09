import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    header: {
        flex: 2,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50,
        alignItems: 'center',
    },
    footer: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30,
        shadowColor: '#eaeef7',
        shadowOffset: {
          width: 10,
          height: 10,
        },
        shadowRadius: 5,
        shadowOpacity: 0.5,
    },
    signIn: {
        width: '100%',
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        // backgroundColor: 'rgba(46, 102, 231,0.5)',
    },
});