import { GeoPoint } from 'firebase/firestore';

export interface Location {
  country: string;
  city: string;
  timezone: string;
  location: GeoPoint;
  altitude: number;
  staticMap?: string;
}
