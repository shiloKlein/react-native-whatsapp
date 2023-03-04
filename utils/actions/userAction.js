import { child, get, getDatabase, ref } from "firebase/database"
import { getFirebaseApp } from "../firebaseHelper"


export const getUserData = async (userId)=>{
try {
    const app = getFirebaseApp()
    const dbRef = ref(getDatabase())
    const userRef = child(dbRef, `user/${userId}`)

    const snapshot = await get(userRef)
    return snapshot.val()
} catch (err) {
    console.log('error in userAction', err);
}
}

