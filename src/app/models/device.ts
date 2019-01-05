import { Battery } from './battery';
import {
  HistoricIndoorDashboardData,
  HistoricMainDashboardData,
  HistoricOutdoorDashboardData,
  HistoricRainGaugeDashboardData,
  HistoricWindGaugeDashboardData,
  IndoorDashboardData,
  MainDashboardData,
  OutdoorDashboardData,
  RainGaugeDashboardData,
  WindGaugeDashboardData,
} from './dashboard-data';

export interface Device {
  id: string;
  name: string;
  firmware: number;
  type: 'NAMain' | 'NAModule1' | 'NAModule2' | 'NAModule3' | 'NAModule4';
}

export interface MainDevice extends Device {
  type: 'NAMain';
  wifiStatus: number;
  current: MainDashboardData;
  last24hHistoric: HistoricMainDashboardData[];
}

export interface ModuleDevice extends Device {
  type: 'NAModule1' | 'NAModule2' | 'NAModule3' | 'NAModule4';
  rfStatus: number;
  battery: Battery;
  current: OutdoorDashboardData | WindGaugeDashboardData | RainGaugeDashboardData | IndoorDashboardData;
  last24hHistoric: Array<
    HistoricOutdoorDashboardData | HistoricWindGaugeDashboardData | HistoricRainGaugeDashboardData | HistoricIndoorDashboardData
  >;
}

export interface OutdoorModuleDevice extends ModuleDevice {
  type: 'NAModule1';
  current: OutdoorDashboardData;
  last24hHistoric: HistoricOutdoorDashboardData[];
}

export interface WindGaugeModuleDevice extends ModuleDevice {
  type: 'NAModule2';
  current: WindGaugeDashboardData;
  last24hHistoric: HistoricWindGaugeDashboardData[];
}

export interface RainGaugeModuleDevice extends ModuleDevice {
  type: 'NAModule3';
  current: RainGaugeDashboardData;
  last24hHistoric: HistoricRainGaugeDashboardData[];
}

export interface IndoorModuleDevice extends ModuleDevice {
  type: 'NAModule4';
  current: IndoorDashboardData;
  last24hHistoric: HistoricIndoorDashboardData[];
}
