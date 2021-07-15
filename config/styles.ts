import { Platform, StyleSheet } from "react-native"

export const mainStyleColors = {
    primaryColor: '#32a19b',
    secondayColor: '#fff',
    invertColor: '#000',
    primaryOpacityColor: '#31a09a3d'
}

export const mainStyles = StyleSheet.create({
    cardList: {
        height: 100,
        width: '90%',
        alignSelf: 'center',
        borderRadius: 10,
        shadowColor: mainStyleColors.primaryColor,
        backgroundColor: mainStyleColors.primaryColor,
        marginTop: 10,
        marginBottom: 10,
        shadowOffset: {
            width: 3,
            height: 3,
        },
        shadowRadius: 5,
        shadowOpacity: 0.2,
        elevation: Platform.OS == 'android' ? 0 : 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardContainer: {
        height: 'auto',
        width: 327,
        alignSelf: 'center',
        borderRadius: 20,
        shadowColor: mainStyleColors.primaryColor,
        backgroundColor: '#ffffff',
        shadowOffset: {
          width: 3,
          height: 3,
        },
        shadowRadius: 20,
        shadowOpacity: 0.2,
        elevation: 5,
        padding: 22,
        marginTop: 50,
    },
    button: {
        width: 327,
        height: 48,
        alignSelf: 'center',
        marginTop: 40,
        borderRadius: 5,
        justifyContent: 'center',
        marginBottom: 0,
        backgroundColor: mainStyleColors.primaryColor,
    },
    separator: {
      height: 0.5,
      width: '100%',
      backgroundColor: '#979797',
      alignSelf: 'center',
      marginVertical: 20,
    },
})