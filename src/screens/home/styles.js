import { StyleSheet } from "react-native";
import { mainStyleColors } from '../../../config/styles';

export const styles = StyleSheet.create({
    createTaskButton: {
      width: '80%',
      height: 32,
      alignSelf: 'center',
      borderRadius: 5,
      justifyContent: 'center',
      marginBottom: 10,
      backgroundColor: mainStyleColors.primaryColor,
    },
  });