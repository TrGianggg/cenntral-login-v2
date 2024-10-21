import {VAPID_KEY} from "@/helper/const";
import {getMessaging, getToken } from "firebase/messaging";
import {updateClientIdApi} from "@/api/user";

export function useFirebase() {
    const messaging = getMessaging();

    const updateFirebaseId = (firebaseId) => {
        if (firebaseId) {
            updateClientIdApi({
                firebaseId: firebaseId
            })
        }
    }

    getToken(messaging, {vapidKey: VAPID_KEY})
        .then((currentToken) => {
            if (currentToken) {
                localStorage.setItem('clientId', currentToken);
                updateFirebaseId(currentToken)
            } else {
                console.log('No registration token available. Request permission to generate one.');
            }
        }).catch((err) => {
        localStorage.setItem('clientIdError', err.toString());
    });
    return {
        messaging
    }
}
