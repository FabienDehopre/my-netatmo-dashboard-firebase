import { Units } from './units';

export interface User {
  access_token: string | null;
  enabled: boolean;
  expires_at: number | null;
  refresh_token: string | null;
  units?: Units;
}
