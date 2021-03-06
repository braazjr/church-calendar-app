import { StyleSheet } from 'react-native';
// import Constants from 'expo-constants';
import { mainStyleColors } from '../../../config/styles';

export const styles = StyleSheet.create({
    createTaskButton: {
      width: 327,
      height: 48,
      alignSelf: 'center',
      marginTop: 40,
      borderRadius: 5,
      justifyContent: 'center',
      marginBottom: 0
    },
    seperator: {
      height: 0.5,
      width: '100%',
      backgroundColor: '#979797',
      alignSelf: 'center',
      marginVertical: 20,
    },
    notes: {
      color: '#9CAAC4',
      fontSize: 16,
      fontWeight: '600',
    },
    notesContent: {
      height: 0.5,
      width: '100%',
      backgroundColor: '#979797',
      alignSelf: 'center',
      marginVertical: 20,
    },
    learn: {
      height: 23,
      width: 51,
      backgroundColor: '#F8D557',
      justifyContent: 'center',
      borderRadius: 5,
    },
    design: {
      height: 23,
      width: 59,
      backgroundColor: '#62CCFB',
      justifyContent: 'center',
      borderRadius: 5,
      marginRight: 7,
    },
    readBook: {
      height: 23,
      marginBottom: 8,
      width: 'auto',
      backgroundColor: '#4CD565',
      justifyContent: 'center',
      borderRadius: 5,
      marginRight: 7,
      paddingHorizontal: 5,
      paddingVertical: 2
    },
    readBookOff: {
      height: 23,
      marginBottom: 8,
      width: 'auto',
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      borderRadius: 5,
      marginRight: 7,
      paddingHorizontal: 5,
      paddingVertical: 2
    },
    title: {
      height: 25,
      borderColor: '#5DD976',
      borderLeftWidth: 1,
      paddingLeft: 8,
      fontSize: 19,
    },
    taskContainer: {
      height: 'auto',
      width: 327,
      alignSelf: 'center',
      borderRadius: 20,
      shadowColor: '#2E66E7',
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
    calenderContainer: {
      marginTop: 30,
      width: 350,
      height: 350,
      alignSelf: 'center',
      marginBottom: -70,
    },
    newTask: {
      flex: 1,
      fontSize: 20,
      width: '100%',
      textAlignVertical: 'center',
      textAlign: 'right',
      marginRight: 60,
    },
    backButton: {
      flex: 1,
      width: '50%',
      textAlignVertical: 'center',
      marginTop: -5,
    },
    container: {
      flex: 1,
      // paddingTop: Constants.statusBarHeight,
      backgroundColor: mainStyleColors.primaryOpacityColor,
    },
  });