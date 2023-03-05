import { getFirebaseApp } from '../firebaseHelper'
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'
import { child, getDatabase, ref, set } from 'firebase/database'
import AsyncStorage from '@react-native-async-storage/async-storage';

import { authenticate } from '../../store/authSlice'


export const signUp = (firstName, lastName, email, password) => {

    return async dispatch => {

        const app = getFirebaseApp()
        const auth = getAuth(app)

        try {
            const result = await createUserWithEmailAndPassword(auth, email, password)
            const { uid, stsTokenManager } = result.user
            const { accessToken, expirationTime } = stsTokenManager

            const expiryDate = new Date(expirationTime)

            const userData = await createUser(firstName, lastName, email, uid)

            dispatch(authenticate({ token: accessToken, userData }))
            saveDataToStorage(accessToken, uid, expiryDate)


        } catch (err) {
            // console.log('err', err)
            const errorCode = err.code
            console.log('err.code', err.code)
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


}

const createUser = async (firstName, lastName, email, userId) => {
    const fullName = `${firstName} ${lastName}`.toLowerCase()
    const userData = {
        firstName,
        lastName,
        fullName,
        email,
        userId,
        signUpDate: new Date().toISOString()
    }

    const dbRef = ref(getDatabase())
    const childRef = child(dbRef, `users/${userId}`)
    // console.log('userData',userData)
    await set(childRef, userData)
    return userData
}

const saveDataToStorage = (token, userId, expiryDate) => {
    AsyncStorage.setItem('userData', JSON.stringify({
        token,
        userId,
        expiryDate:expiryDate.toISOString()
    }))
}

export const signIn = (email, password) => {
    console.log(email, password);
}