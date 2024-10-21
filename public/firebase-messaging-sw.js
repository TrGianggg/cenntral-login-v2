importScripts('https://cdnjs.cloudflare.com/ajax/libs/firebase/8.10.1/firebase.js');
importScripts('https://cdnjs.cloudflare.com/ajax/libs/firebase/8.10.1/firebase-messaging.min.js');

firebase.initializeApp({
    apiKey: "AIzaSyCUnDuaii5ZyYGcYpv1afxaVkyicualeJ8",
    authDomain: "tomiru-4ae93.firebaseapp.com",
    projectId: "tomiru-4ae93",
    storageBucket: "tomiru-4ae93.appspot.com",
    messagingSenderId: "763283167374",
    appId: "1:763283167374:web:6a80b2dce4339d94eed1df",
    measurementId: "G-YZZK92B2WK"
})
// const messaging = firebase.messaging();
self.addEventListener('push', function (event) {
    const payload = event.data.json();
    const { title, body, click_action } = payload.notification;
    const options = {
        body: body,
        icon: '/firebase-logo.png',
        data: {
            url: `${location.origin}${click_action}`
        }
    };
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', function (event) {
    const clickedNotification = event.notification;
    const url = clickedNotification.data.url;
    if (url) {
        clients.openWindow(url);
    } else {
        console.log('Notification clicked without a specific URL');
    }
    clickedNotification.close();
});