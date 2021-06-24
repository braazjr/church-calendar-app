import firestore from '@react-native-firebase/firestore';

import { updateMinistersOnUser } from './user';

const getMinisters = () => firestore()
    .collection('ministers')

const updateMinister = item => {
    return new Promise(resolve => {
        if (item.id) {
            return firestore()
                .collection('ministers')
                .doc(item.id)
                .set(Object.assign({}, item))
                .then(() => resolve(item.id))
        } else {
            return firestore()
                .collection('ministers')
                .add({ ...item })
                .then(data => resolve(data.id))
        }
    })
}

const deleteMinister = (ministerId) => {
    return firestore()
        .collection('minister')
        .doc(ministerId)
        .delete()
}

const addUserOnMinister = async (ministerId, userId) => {
    try {
        const userData = await firestore()
            .collection('users')
            .doc(userId)
            .get()

        let { ministers } = userData.data()
        if (!ministers) {
            ministers = [ministerId]
        } else {
            ministers.push(ministerId)
        }

        await updateMinistersOnUser(userId, ministers)

        return true
    } catch (error) {
        console.error('ADD_USER_ON_MINISTER_ERROR', error)
        throw error
    }
}

const removeUserOnMinister = async (ministerId, userId) => {
    try {
        const userData = await firestore()
            .collection('users')
            .doc(userId)
            .get()

        let { ministers } = userData.data()
        const ministerIndex = ministers.indexOf(ministerId)
        ministers.splice(ministerIndex, 1)

        await updateMinistersOnUser(userId, ministers)

        return true
    } catch (error) {
        console.error('REMOVE_USER_ON_MINISTER_ERROR', error)
        return false
    }
}

export {
    getMinisters,
    updateMinister,
    deleteMinister,
    addUserOnMinister,
    removeUserOnMinister
}