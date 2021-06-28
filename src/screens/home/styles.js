import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    taskListContent: {
      height: 100,
      width: '90%',
      alignSelf: 'center',
      borderRadius: 10,
      shadowColor: '#2E66E7',
      backgroundColor: '#32a19b',
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
    viewTask: {
      position: 'absolute',
      bottom: '15%',
      right: 17,
      height: 60,
      width: 60,
      backgroundColor: '#32a19b',
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#fff',
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowRadius: 30,
      shadowOpacity: 0.5,
      elevation: 5,
      zIndex: 999,
    },
    deleteButton: {
      backgroundColor: '#ff6347',
      width: 100,
      height: 38,
      alignSelf: 'center',
      marginTop: 40,
      borderRadius: 5,
      justifyContent: 'center',
    },
    updateButton: {
      backgroundColor: '#2E66E7',
      width: 100,
      height: 38,
      alignSelf: 'center',
      marginTop: 40,
      borderRadius: 5,
      justifyContent: 'center',
      marginRight: 20,
    },
    separator: {
      height: 0.5,
      width: '100%',
      backgroundColor: '#979797',
      alignSelf: 'center',
      marginVertical: 20,
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
      width: 83,
      backgroundColor: '#4CD565',
      justifyContent: 'center',
      borderRadius: 5,
      marginRight: 7,
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
    },
    newTask: {
      alignSelf: 'center',
      fontSize: 20,
      width: 120,
      height: 25,
      textAlign: 'center',
      fontWeight: '700',
      marginBottom: 30
    },
  });