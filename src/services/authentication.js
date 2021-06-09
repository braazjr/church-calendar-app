import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';

const signInWithGoogle = async () => {
    try {
        GoogleSignin.configure({
            iosClientId: '278377666917-bungfka0rudvngekh884k97378nb3322.apps.googleusercontent.com',
            webClientId: '278377666917-adve2cdqh3ers2u30e9dh7fb2kulqo98.apps.googleusercontent.com',
        });
    
        const { idToken } = await GoogleSignin.signIn();
    
        if (!idToken) {
            console.error('\nSIGN_IN_WITH_GOOGLE_ERROR\n')
            return
        }
    
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        const userCredential = await auth().signInWithCredential(googleCredential);
    
        checkUserFromFirestore(userCredential.user)
    
        return userCredential
    } catch(error) {
        alert(error)
    }
}

const checkUserFromFirestore = async (user) => {
    firestore()
        .collection('users')
        .where('email', '==', user.email)
        .onSnapshot(observer => {
            let users = observer.docs
                .map(doc => ({ id: doc.id, ...doc.data() }));

            if (!users || users.length == 0) {
                let newUser = {
                    name: user.displayName,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    photoUrl: user.photoURL,
                    uid: user.uid,
                }

                firestore()
                    .collection('users')
                    .add({ ...newUser })
                    .then(data => console.info('-- user created', data.id))
            } else {
                let userFound = users[0]
                userFound.name = user.displayName
                // userFound.email = user.email
                userFound.phoneNumber = user.phoneNumber
                userFound.photoUrl = user.photoURL
                userFound.uid = user.uid

                firestore()
                    .collection('users')
                    .doc(userFound.id)
                    .set({ ...userFound })
                    .then(() => console.info('-- user updated', userFound.id))
            }
        });
}

const getLoggedUser = async () => {
    try {
        const uid = auth()
            .currentUser
            .uid


        const userData = await firestore()
            .collection('users')
            .where('uid', '==', uid)
            .get()

        const user = userData.docs[0].data()
        return { id: userData.docs[0].id, ...user }
    } catch (error) {
        console.error('GET_LOGGED_USER_ERROR', error)
    }
}

const logoff = async () => {
    await auth()
      .signOut()

    const tokens = await GoogleSignin.getTokens()
    await GoogleSignin.clearCachedAccessToken(tokens.accessToken)
}

const isLeader = async () => {
    const user = await getLoggedUser()
    return user.ministersLead && user.ministersLead.length > 0
}

export {
    signInWithGoogle,
    getLoggedUser,
    logoff,
    isLeader
}