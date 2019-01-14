import { Battery } from './battery';
import {
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
}

export interface ModuleDevice extends Device {
  type: 'NAModule1' | 'NAModule2' | 'NAModule3' | 'NAModule4';
  rfStatus: number;
  battery: Battery;
  current: OutdoorDashboardData | WindGaugeDashboardData | RainGaugeDashboardData | IndoorDashboardData;
}

export interface OutdoorModuleDevice extends ModuleDevice {
  type: 'NAModule1';
  current: OutdoorDashboardData;
}

export interface WindGaugeModuleDevice extends ModuleDevice {
  type: 'NAModule2';
  current: WindGaugeDashboardData;
}

export interface RainGaugeModuleDevice extends ModuleDevice {
  type: 'NAModule3';
  current: RainGaugeDashboardData;
}

export interface IndoorModuleDevice extends ModuleDevice {
  type: 'NAModule4';
  current: IndoorDashboardData;
}
