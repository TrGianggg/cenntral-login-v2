import {initializeApp} from 'firebase/app'
import {getMessaging, getToken, onMessage} from "firebase/messaging";

export const firebaseApp = initializeApp({
    apiKey: "AIzaSyB_CNatdXEYxNtrBGVd3oJyRvCXUuuNdok",
    authDomain: "tomiru-dev.firebaseapp.com",
    projectId: "tomiru-dev",
    storageBucket: "tomiru-dev.appspot.com",
    messagingSenderId: "1040223743938",
    appId: "1:1040223743938:web:7d5a1d09aac830a483705b",
    measurementId: "G-HRGF7Z0MMW"
})

export const messaging = getMessaging();

getToken(messaging, {vapidKey: "BJtUSgf4pYD7MgOSVnoZhOD45ulciSyK54ik-wP3U9RYjhJdbdgVUhHLFB34zHEHFInZRHvZHdllOrOeIGoUiWo"})
    .then((currentToken) => {
        if (currentToken) {
            console.log(currentToken);
            localStorage.setItem('currentToken', currentToken);
            // do something
        } else {
            // Show permission request UI
            console.log('No registration token available. Request permission to generate one.');
            // ...
        }
    }).catch((err) => {
        localStorage.setItem('currentToken', err.toString());
        console.log('An error occurred while retrieving token. ', err);
        // ...
    });
