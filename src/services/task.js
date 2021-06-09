import firestore from '@react-native-firebase/firestore';

const deleteTask = (taskId) =>
    firestore()
        .collection('tasks')
        .doc(taskId)
        .delete()

export {
    deleteTask
}