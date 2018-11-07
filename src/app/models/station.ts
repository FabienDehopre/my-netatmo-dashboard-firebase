export interface Station {
  id: string;
  name: string;
  location: {
    country: string;
    city: string;
    timezone: string;
    location: [number, number];
    altitude: number;
  };
}
