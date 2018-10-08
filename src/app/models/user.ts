export interface User {
  uid: string;
  access_token: string | null;
  expires_at: number | null;
  refresh_token: string | null;
}
