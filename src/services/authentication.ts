import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';
import { appleAuth } from '@invertase/react-native-apple-authentication';

import { User } from '../models/user-model';
import { updateFCMTokenOnLoggedUser } from './user';

const signInWithGoogle = async () => {
    try {
        GoogleSignin.configure({
            iosClientId: '278377666917-bungfka0rudvngekh884k97378nb3322.apps.googleusercontent.com',
            webClientId: '278377666917-adve2cdqh3ers2u30e9dh7fb2kulqo98.apps.googleusercontent.com',
        });

        const { idToken } = await GoogleSignin.signIn();

        if (!idToken) {
            console.error('\nSIGN_IN_WITH_GOOGLE_ERROR\n')
            return Promise.reject("SIGN_IN_WITH_GOOGLE_ERROR")
        }

        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        const userCredential = await auth().signInWithCredential(googleCredential);

        // checkUserFromFirestore(userCredential.user)

        return true
    } catch (error) {
        Alert.alert(error)
    }
}

const checkUserFromFirestore = async (user) => {
    firestore()
        .collection('users')
        .doc(user.uid)
        .onSnapshot(observer => {
            if (!observer.exists || !observer.data()) {
                let newUser = {
                    name: user.displayName,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    photoUrl: user.photoURL,
                }

                firestore()
                    .collection('users')
                    .doc(user.uid)
                    .set({ ...newUser })
                    .then(() => console.info('user created', user.uid))
                    .then(() => checkFCMPermissions())
            } else {
                let userFound = observer.data() as User
                userFound.name = user.displayName || userFound.name
                // userFound.email = user.email
                userFound.phoneNumber = user.phoneNumber || userFound.phoneNumber
                userFound.photoUrl = user.photoURL || userFound.photoUrl

                firestore()
                    .collection('users')
                    .doc(user.uid)
                    .set({ ...userFound })
                    .then(() => console.info('user updated', user.uid))
            }
        });
}

const getLoggedUser = async (): Promise<User> => {
    try {
        const uid = auth()
            .currentUser
            .uid

        const userData = await firestore()
            .collection('users')
            .doc(uid)
            .get()

        if (!userData.exists || !userData.data()) {
            return new User()
        }

        const user = userData.data()
        return {
            id: userData.id,
            ...user,
            isLeader: user.ministersLead && user.ministersLead.length > 0
        } as User
    } catch (error) {
        console.error('GET_LOGGED_USER_ERROR', error)

        throw 'GET_LOGGED_USER_ERROR'
    }
}

const logoff = async () => {
    const tokens = await GoogleSignin.getTokens()
    await GoogleSignin.clearCachedAccessToken(tokens.accessToken)

    await auth()
        .signOut()
}

const isLeader = async () => {
    const user = await getLoggedUser()
    return user.ministersLead && user.ministersLead.length > 0
}

const checkFCMPermissions = async () => {
    const authorizationStatus = await messaging().requestPermission()
    if (authorizationStatus == messaging.AuthorizationStatus.AUTHORIZED || authorizationStatus == messaging.AuthorizationStatus.PROVISIONAL) {
        const token = await messaging().getToken()
        await updateFCMTokenOnLoggedUser(token)
    }
}

const signInWithApple = async () => {
    const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [
            appleAuth.Scope.EMAIL,
            appleAuth.Scope.FULL_NAME,
        ],
    });

    if (!appleAuthRequestResponse.identityToken) {
        throw 'Apple Sign-In failed - no identify token returned';
    }

    const { identityToken, nonce } = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);

    return auth().signInWithCredential(appleCredential);
}

export {
    signInWithGoogle,
    getLoggedUser,
    logoff,
    isLeader,
    checkFCMPermissions,
    signInWithApple,
    checkUserFromFirestore
}