import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  listContent: {
      height: 'auto',
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
      elevation: Platform.OS == 'android' ? 0: 3,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      alignSelf: 'center',
      fontSize: 18,
      width: 120,
      height: 25,
      textAlign: 'center',
      fontWeight: '700',
      marginBottom: 20,
      marginTop: 10,
    },
  });