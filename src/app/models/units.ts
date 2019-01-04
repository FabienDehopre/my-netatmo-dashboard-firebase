export enum Unit {
  metric = 0,
  imperial = 1,
}

export enum WindUnit {
  kph = 0,
  mph = 1,
  ms = 2,
  beaufort = 3,
  knot = 4,
}

export enum PressureUnit {
  mbar = 0,
  inHg = 1,
  mmHg = 2,
}

export enum FeelLike {
  humidex = 0,
  heatIndex = 1,
}

export interface Units {
  feelLike: FeelLike;
  pressureUnit: PressureUnit;
  unit: Unit;
  windUnit: WindUnit;
}
