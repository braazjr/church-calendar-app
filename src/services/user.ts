import firestore from '@react-native-firebase/firestore';
import { getLoggedUser } from './authentication';
import { User } from '../models/user.model';
import auth from '@react-native-firebase/auth';

const getUsersFromMinister = (ministerId): Promise<User[]> => {
    return new Promise(resolve => {
        firestore()
            .collection('users')
            .where('ministers', 'array-contains', ministerId)
            .onSnapshot(observer => {
                resolve(observer.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }) as User));
            });
    })
}

const getUsers = (): Promise<User[]> => {
    return new Promise(resolve => {
        firestore()
            .collection('users')
            // .where('ministers', 'array-contains', ministerId)
            .onSnapshot(observer => {
                resolve(observer.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }) as User));
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

const updateUser = async (userId, params) => {
    const authBody = {}
    if (params.name) authBody['name'] = params.name
    if (params.photoUrl) authBody['photoURL'] = params.photoUrl

    await auth()
        .currentUser
        .updateProfile(authBody)

    await firestore()
        .collection('users')
        .doc(userId)
        .update(params)
}

export {
    getUsersFromMinister,
    getUsers,
    updateMinistersOnUser,
    updateFCMTokenOnLoggedUser,
    updateUser
}