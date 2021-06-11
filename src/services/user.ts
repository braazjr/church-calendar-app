import firestore from '@react-native-firebase/firestore';
import { getLoggedUser } from './authentication';

const getUsersFromMinister = (ministerId) => {
    return new Promise(resolve => {
        firestore()
            .collection('users')
            .where('ministers', 'array-contains', ministerId)
            .onSnapshot(observer => {
                resolve(observer.docs
                    .map(doc => ({ id: doc.id, ...doc.data() })));
            });
    })
}

const getUsers = () => {
    return new Promise(resolve => {
        firestore()
            .collection('users')
            // .where('ministers', 'array-contains', ministerId)
            .onSnapshot(observer => {
                resolve(observer.docs
                    .map(doc => ({ id: doc.id, ...doc.data() })));
            });
    })
}

const updateMinistersOnUser = async (userId, ministers) =>
    await firestore()
        .collection('users')
        .doc(userId)
        .update({ ministers })

const updateFCMTokenOnLoggedUser = async (token) => {
    const loggedUser = await getLoggedUser()
    const tokens = [].concat(loggedUser.tokens || [])
    
    if (tokens.indexOf(token) == -1) {
        tokens.push(token)

        await firestore()
            .collection('users')
            .doc(loggedUser.id)
            .update({ tokens })

        return true
    }

    return true
}

export {
    getUsersFromMinister,
    getUsers,
    updateMinistersOnUser,
    updateFCMTokenOnLoggedUser
}