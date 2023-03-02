import { getFirebaseApp } from '../firebaseHelper'
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'

export const signUp = async (firstName, lastName, email, password) => {
    const app = getFirebaseApp()
    const auth = getAuth(app)

    try {
        const result = await createUserWithEmailAndPassword(auth, email, password)
        console.log('result', result)
    } catch (err) {
        // console.log(err.code);
        const errorCode = err.code
console.log('err.code',err.code)
        let message = 'something went wrong.'

        if (errorCode === 'auth/email-already-in-use') {
            message = 'This email is already in use'

        }
        if (errorCode === 'auth/invalid-email') {
            message = 'Invalid email address'

        }
        throw new Error(message)
    }

}
export const signIn = (email, password) => {
    console.log(email, password);
}