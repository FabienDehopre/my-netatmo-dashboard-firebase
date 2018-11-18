import { Unit, WindUnit, PressureUnit, FeelLike } from './units';

export interface User {
  enabled: boolean;
  access_token: string | null;
  expires_at: number | null;
  refresh_token: string | null;
  unit?: Unit;
  windUnit?: WindUnit;
  pressureUnit?: PressureUnit;
  feelLike?: FeelLike;
}
