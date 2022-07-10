import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDtFQlQQ7blZEt9_JnJ9whjpkUiywofYDY",
    authDomain: "twitterclone-73154.firebaseapp.com",
    databaseURL: 'https://twitterclone-73154-default-rtdb.firebaseio.com',
    projectId: "twitterclone-73154",
    storageBucket: "twitterclone-73154.appspot.com",
    messagingSenderId: "933933670523",
    appId: "1:933933670523:web:d6e2b79d24d45865f742de",
}

if (!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)
}

export {firebase};