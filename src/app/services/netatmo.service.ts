import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { NetatmoAuthorization } from '../models/netatmo-authorization';

@Injectable({
  providedIn: 'root',
})
export class NetatmoService {
  constructor(private readonly http: HttpClient) {}

  buildAuthorizationUrl(): string {
    const state = 'dskfjqisfmjioeznf';
    sessionStorage.setItem('netatmo_state', state);
    return `https://api.netatmo.com/oauth2/authorize?client_id=${environment.netatmo.clientId}&redirect_uri=${
      environment.netatmo.redirectUri
    }&scope=read_station&state=${state}`;
  }

  exchangeCodeForAccessToken(state: string, code: string, error: string): Observable<NetatmoAuthorization> {
    const sessionStorageState = sessionStorage.getItem('netatmo_state');
    sessionStorage.removeItem('netatmo_state');
    if (error != null) {
      return throwError(new Error(error));
    } else if (state !== sessionStorageState) {
      return throwError(new Error('invalid_state'));
    }

    const body = new HttpParams()
      .set('grant_type', 'authorization_code')
      .set('client_id', environment.netatmo.clientId)
      .set('client_secret', environment.netatmo.clientSecret)
      .set('code', code)
      .set('redirect_uri', environment.netatmo.redirectUri)
      .set('scope', 'read_station');
    return this.http.post<NetatmoAuthorization>('https://api.netatmo.com/oauth2/token', body.toString(), {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8'),
    });
  }
}
