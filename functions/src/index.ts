import * as admin from 'firebase-admin';

admin.initializeApp();
admin.firestore().settings({ timestampsInSnapshots: true });

export * from './functions/firestore/update-static-map-url';
export * from './functions/http/fetch-update';
export * from './functions/pubsub/fetch-update';
