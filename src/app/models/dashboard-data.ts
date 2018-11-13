import * as firebase from 'firebase/app';

export interface DashboardData {
  timeUtc: firebase.firestore.Timestamp;
  type: 'NAMain' | 'NAModule1' | 'NAModule2' | 'NAModule3' | 'NAModule4';
}

export type Trend = 'up' | 'down' | 'stable';

export interface TemperatureData {
  current: number;
  min: {
    value: number;
    timeUtc: firebase.firestore.Timestamp;
  };
  max: {
    value: number;
    timeUtc: firebase.firestore.Timestamp;
  };
  trend: Trend;
}

export interface MainDashboardData extends DashboardData {
  type: 'NAMain';
  temperature: TemperatureData;
  pressure: {
    value: number;
    absolute: number;
    trend: Trend;
  };
  co2: number;
  humidity: number;
  noise: number;
}

export interface IndoorDashboardData extends DashboardData {
  type: 'NAModule4';
  temperature: TemperatureData;
  co2: number;
  humidity: number;
}

export interface OutdoorDashboardData extends DashboardData {
  type: 'NAModule1';
  temperature: TemperatureData;
  humidity: number;
}

export interface WindGaugeDashboardData extends DashboardData {
  type: 'NAModule2';
  // TODO: the doc is not really precise so I'll wait until I have a Wind Gauge module
}

export interface RainGaugeDashboardData extends DashboardData {
  type: 'NAModule3';
  // TODO: the doc is not really precise so I'll wait until I have a Rain Gauge module
}
