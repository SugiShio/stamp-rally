import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage, ref } from 'firebase/storage'

export const getFirestoreFormat = (object) => {
    return normalizeObject(object)
}

const normalizeObject = (object) => {
    if (object === undefined) {
        return null
    } else if (typeof object === 'string' || object === null) {
        return object
    } else if (Array.isArray(object)) {
        return object.map((o) => {
            return normalizeObject(o)
        })
    } else if (Object.keys(object).length) {
        const result = {}

        Object.keys(object).forEach((key) => {
            result[key] = normalizeObject(object[key])
        })
        return result
    }

    return object
}

const firebaseConfig = {
    apiKey: "AIzaSyDkM8TLeM6A2J9MbkijZ0U-TR4GbXuSY3g",
    authDomain: "japanese-nabe.firebaseapp.com",
    projectId: "japanese-nabe",
    storageBucket: "japanese-nabe.appspot.com",
    messagingSenderId: "816133653445",
    appId: "1:816133653445:web:b851c40e5460b1024501ac",
    measurementId: "G-EYC91K0XBF"
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const storageRef = ref(storage)
