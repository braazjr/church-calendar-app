import firestore from '@react-native-firebase/firestore';

export const deleteTask = (taskId) =>
    firestore()
        .collection('tasks')
        .doc(taskId)
        .delete()

export const updateTask = async (item) => {
    item.date = firestore.Timestamp.fromDate(item.date)

    if (item.id) {
        return firestore()
          .collection('tasks')
          .doc(item.id)
          .set(Object.assign({}, item))
      } else {
        delete item.id
        return firestore()
          .collection('tasks')
          // .doc()
          .add({...item})
      }
}