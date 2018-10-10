import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

admin.initializeApp();

export const enable = functions.https.onCall((data: any, context: functions.https.CallableContext) => {
  const uid = context.auth.uid;
  return admin
    .database()
    .ref(`/users/${uid}`)
    .update({ enabled: true })
    .then(() => {
      return { enabled: true };
    });
});

export const disable = functions.https.onCall((data: any, context: functions.https.CallableContext) => {
  const uid = context.auth.uid;
  return admin
    .database()
    .ref(`/users/${uid}`)
    .update({ enabled: false })
    .then(() => {
      return { enabled: false };
    });
});
