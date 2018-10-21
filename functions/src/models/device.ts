export interface Device {
  name: string;
  firmware: number;
  type: 'NAMain' | 'NAModule1' | 'NAModule2' | 'NAModule3' | 'NAModule4';
}

export interface MainDevice extends Device {
  type: 'NAMain';
  wifiStatus: number;
}

export interface ModuleDevice extends Device {
  type: 'NAModule1' | 'NAModule2' | 'NAModule3' | 'NAModule4';
  rfStatus: number;
  battery: {
    vp: number;
    percent: number;
  };
}

export interface OutdoorModuleDevice extends ModuleDevice {
  type: 'NAModule1';
}

export interface WindGaugeModuleDevice extends ModuleDevice {
  type: 'NAModule2';
}

export interface RainGaugeModuleDevice extends ModuleDevice {
  type: 'NAModule3';
}

export interface IndoorModuleDevice extends ModuleDevice {
  type: 'NAModule4';
}
