import { firestore } from 'firebase-admin';

export interface DashboardData {
  timeUtc: firestore.Timestamp;
  type: 'NAMain' | 'NAModule1' | 'NAModule2' | 'NAModule3' | 'NAModule4';
  deviceId: string;
}

export type Trend = 'up' | 'down' | 'stable';

export interface TemperatureData {
  current: number;
  min: {
    value: number;
    timeUtc: firestore.Timestamp;
  };
  max: {
    value: number;
    timeUtc: firestore.Timestamp;
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

export interface HistoricMainDashboardData {
  timeUtc: firestore.Timestamp;
  temperature: number;
  pressure: number;
  co2: number;
  humidity: number;
  noise: number;
}

export interface OutdoorDashboardData extends DashboardData {
  type: 'NAModule1';
  temperature: TemperatureData;
  humidity: number;
}

export interface HistoricOutdoorDashboardData {
  timeUtc: firestore.Timestamp;
  temperature: number;
  humidity: number;
}

export interface WindGaugeDashboardData extends DashboardData {
  type: 'NAModule2';
  windStrength: number;
  windAngle: number;
  gustStrength: number;
  gustAngle: number;
  windHistoric: { windStrength: number; windAngle: number }[];
}

export interface HistoricWindGaugeDashboardData {
  timeUtc: firestore.Timestamp;
  windStrength: number;
  windAngle: number;
  gustStrength: number;
  gustAngle: number;
}

export interface RainGaugeDashboardData extends DashboardData {
  type: 'NAModule3';
  rain: number;
  sum1h: number;
  sum24h: number;
}

export interface HistoricRainGaugeDashboardData {
  timeUtc: firestore.Timestamp;
  rain: number;
}

export interface IndoorDashboardData extends DashboardData {
  type: 'NAModule4';
  temperature: TemperatureData;
  co2: number;
  humidity: number;
}

export interface HistoricIndoorDashboardData {
  timeUtc: firestore.Timestamp;
  temperature: number;
  co2: number;
  humidity: number;
}

export function mapMainDashboardData2HistoricMainDashboardData(source: MainDashboardData): HistoricMainDashboardData {
  return {
    timeUtc: source.timeUtc,
    temperature: source.temperature.current,
    pressure: source.pressure.value,
    co2: source.co2,
    humidity: source.humidity,
    noise: source.noise,
  };
}

function mapOutdoorDashboardData2HistoricOutdoorDashboardData(source: OutdoorDashboardData): HistoricOutdoorDashboardData {
  return {
    timeUtc: source.timeUtc,
    temperature: source.temperature.current,
    humidity: source.humidity,
  };
}

function mapWindGaugeDashboardData2HistoryWindGaugeDashboardData(source: WindGaugeDashboardData): HistoricWindGaugeDashboardData {
  return {
    timeUtc: source.timeUtc,
    windStrength: source.windStrength,
    windAngle: source.windAngle,
    gustStrength: source.gustStrength,
    gustAngle: source.gustAngle,
  };
}

function mapRainGaugeDashboardData2HistoricRainGaugeDashboardData(source: RainGaugeDashboardData): HistoricRainGaugeDashboardData {
  return {
    timeUtc: source.timeUtc,
    rain: source.rain,
  };
}

function mapIndoorDashboardData2HistoricIndoorDashboardData(source: IndoorDashboardData): HistoricIndoorDashboardData {
  return {
    timeUtc: source.timeUtc,
    temperature: source.temperature.current,
    co2: source.co2,
    humidity: source.humidity,
  };
}

export function mapModuleDashboardData2HistoricModuleDashboardData(
  source: OutdoorDashboardData | WindGaugeDashboardData | RainGaugeDashboardData | IndoorDashboardData
): HistoricOutdoorDashboardData | HistoricWindGaugeDashboardData | HistoricRainGaugeDashboardData | HistoricIndoorDashboardData {
  switch (source.type) {
    case 'NAModule1':
      return mapOutdoorDashboardData2HistoricOutdoorDashboardData(source);
    case 'NAModule2':
      return mapWindGaugeDashboardData2HistoryWindGaugeDashboardData(source);
    case 'NAModule3':
      return mapRainGaugeDashboardData2HistoricRainGaugeDashboardData(source);
    case 'NAModule4':
      return mapIndoorDashboardData2HistoricIndoorDashboardData(source);
    default:
      throw new Error('Invalid module dashboard data type.');
  }
}
