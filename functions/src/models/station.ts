import { firestore } from 'firebase-admin';

import { Device } from './device';

export interface Station {
  name: string;
  location: {
    country: string;
    city: string;
    timezone: string;
    location: firestore.GeoPoint;
    altitude: number;
    staticMap?: string;
  };
  devices: Device[];
}
