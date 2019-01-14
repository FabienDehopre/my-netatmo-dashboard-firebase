import { Timestamp } from 'firebase/firestore';

export interface DashboardData {
  timeUtc: Timestamp;
  type: 'NAMain' | 'NAModule1' | 'NAModule2' | 'NAModule3' | 'NAModule4';
  deviceId: string;
}

export type Trend = 'up' | 'down' | 'stable';

export interface TemperatureData {
  current: number;
  min: {
    value: number;
    timeUtc: Timestamp;
  };
  max: {
    value: number;
    timeUtc: Timestamp;
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

export interface OutdoorDashboardData extends DashboardData {
  type: 'NAModule1';
  temperature: TemperatureData;
  humidity: number;
}

export interface WindGaugeDashboardData extends DashboardData {
  type: 'NAModule2';
  windStrength: number;
  windAngle: number;
  gustStrength: number;
  gustAngle: number;
  windHistoric: Array<{ windStrength: number; windAngle: number }>;
}

export interface RainGaugeDashboardData extends DashboardData {
  type: 'NAModule3';
  rain: number;
  sum1h: number;
  sum24h: number;
}

export interface IndoorDashboardData extends DashboardData {
  type: 'NAModule4';
  temperature: TemperatureData;
  co2: number;
  humidity: number;
}
