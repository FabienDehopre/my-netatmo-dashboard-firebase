import { firestore } from 'firebase-admin';

export interface Station {
  name: string;
  location: {
    country: string;
    city: string;
    timezone: string;
    location: firestore.GeoPoint;
    altitude: number;
  };
}
