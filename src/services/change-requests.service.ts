import firestore from '@react-native-firebase/firestore'
import { ChangeRequest } from '../models/change-request-model'
import { Task } from '../models/task-model'
import { getLoggedUser } from './authentication'
import { getTaskById, updateTask } from './task'

export const changeRequestCollection = firestore().collection('change-requests')

export const createChangeRequest = async (taskId: string) => {
    const task: Task = await getTaskById(taskId)

    return changeRequestCollection
        .add({
            requestDateTime: firestore.Timestamp.now(),
            task
        })
        .then(async () => {
            task.hasOpenChangeRequest = true
            await updateTask(task, false)
        })
}

export const updateChangeRequest = async (changeRequest: ChangeRequest) => {
    return changeRequestCollection
        .doc(changeRequest.id)
        .set(Object.assign({}, changeRequest))
}

export const getChangeRequestById = async (changeRequestId) => {
    return changeRequestCollection
        .doc(changeRequestId)
        .get()
        .then(doc => ({ id: doc.id, ...doc.data() }))
}

export const doneChangeRequest = async (changeRequestId) => {
    const user = await getLoggedUser()
    const changeRequest: ChangeRequest = await getChangeRequestById(changeRequestId) as ChangeRequest
    const task: Task = await getTaskById(changeRequest.task.id) as Task

    changeRequest.done = true
    changeRequest.doneDateTime = firestore.Timestamp.now()
    task.ministry = { id: user.id, name: user.name }
    changeRequest.newTask = task

    return Promise.all([
        updateChangeRequest(changeRequest),
        updateTask(task, false)
    ])
}

export const deleteChangeRequest = async (changeRequestId) => {
    return changeRequestCollection
        .doc(changeRequestId)
        .delete()
}