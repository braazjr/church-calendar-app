import firestore from '@react-native-firebase/firestore';
import { Task } from '../models/task-model';

export const deleteTask = (taskId) =>
  firestore()
    .collection('tasks')
    .doc(taskId)
    .delete()

export const updateTask = async (item, convertTimestamp = true) => {
  if (convertTimestamp) item.date = firestore.Timestamp.fromDate(item.date)

  if (item.id) {
    return firestore()
      .collection('tasks')
      .doc(item.id)
      .set(Object.assign({}, item))
  } else {
    delete item.id
    return firestore()
      .collection('tasks')
      .add({ ...item })
  }
}

export const getTaskById = async (id): Promise<Task> => {
  return firestore()
    .collection('tasks')
    .doc(id)
    .get()
    .then(data => ({ id: data.id, ...data.data() }) as Task)
}