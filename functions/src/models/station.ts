export interface Station {
  name: string;
  location: {
    country: string;
    city: string;
    timezone: string;
    location: [number, number];
    altitude: number;
  };
}
