import { Device } from './device';
import { Location } from './location';

export interface Station {
  name: string;
  location: Location;
  devices: Device[];
}

export interface StationVM extends Station {
  id: string;
}

export interface StationMenuItem {
  id: string;
  name: string;
}
