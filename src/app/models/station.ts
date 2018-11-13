import * as firebase from 'firebase/app';

export interface Station {
  name: string;
  location: {
    country: string;
    city: string;
    timezone: string;
    location: firebase.firestore.GeoPoint;
    altitude: number;
  };
}

export interface StationDisplay extends Station {
  id: string;
}
