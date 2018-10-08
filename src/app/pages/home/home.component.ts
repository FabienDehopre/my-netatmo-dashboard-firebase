import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { NetatmoAuthorization } from '../../models/netatmo-authorization';
import { User } from '../../models/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  values$: Observable<User>;
  netatmoAuthorize: string | null = null;
  authorizeError: string | null = null;

  constructor(
    readonly afAuth: AngularFireAuth,
    private readonly afs: AngularFirestore,
    private readonly activatedRoute: ActivatedRoute,
    private readonly http: HttpClient
  ) {}

  ngOnInit() {
    this.authorizeError = null;
    this.netatmoAuthorize = null;
    if (this.activatedRoute.snapshot.queryParamMap.has('error')) {
      const error = this.activatedRoute.snapshot.queryParamMap.get('error');
      switch (error) {
        case 'invalid_request':
          this.authorizeError =
            'The request is missing a required parameter, includes an unsupported parameter or parameter value, or is otherwise malformed.';
          break;
        case 'invalid_client':
          this.authorizeError = 'The client identifier provided is invalid.';
          break;
        case 'unauthorized_client':
          this.authorizeError = 'The client is not authorized to use the requested response type.';
          break;
        case 'redirect_uri_mismatch':
          this.authorizeError = 'The redirection URI provided does not match a pre-registered value.';
          break;
        case 'access_denied':
          this.authorizeError = 'The end-user or authorization server denied the request.';
          break;
        case 'unsupported_response_type':
          this.authorizeError = 'The requested response type is not supported by the authorization server.';
          break;
        case 'invalid_scope':
          this.authorizeError = 'The requested scope is invalid, unknown, or malformed.';
          break;
      }
    } else {
      this.values$ = this.afAuth.user.pipe(
        map(user => user.uid),
        switchMap(uid =>
          this.afs
            .collection('users')
            .doc<User>(uid)
            .valueChanges()
        ),
        tap(user => {
          if (user == null || user.access_token == null) {
            const state = 'dskfjqisfmjioeznf';
            sessionStorage.setItem('netatmo_state', state);
            this.netatmoAuthorize = `https://api.netatmo.com/oauth2/authorize?client_id=${
              environment.netatmo.clientId
            }&redirect_uri=http://localhost:4200/callback&scope=read_station&state=${state}`;
          }
        }),
        switchMap(user => {
          if (user != null && user.expires_at <= Date.now() && user.refresh_token != null) {
            const body = new HttpParams()
              .set('grant_type', 'refresh_token')
              .set('client_id', environment.netatmo.clientId)
              .set('client_secret', environment.netatmo.clientSecret)
              .set('refresh_token', user.refresh_token);
            console.log('refresh netatmo access token using refresh token');
            return this.http
              .post<NetatmoAuthorization>('https://api.netatmo.com/oauth2/token', body.toString(), {
                headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8'),
              })
              .pipe(
                map(
                  res => ({
                    uid: user.uid,
                    access_token: res.access_token,
                    expires_at: new Date(Date.now() + res.expires_in * 1000).valueOf(),
                    refresh_token: res.refresh_token,
                  }),
                  tap((newUser: User) => {
                    this.afs
                      .collection('users')
                      .doc<User>(user.uid)
                      .set(newUser);
                  })
                )
              );
          } else {
            return of(user);
          }
        }),
        catchError(err => {
          console.error('An error occurred while fetching data from firestore:', err);
          return of(null);
        })
      );
    }
  }

  logout(): void {
    this.afAuth.auth.signOut();
  }
}
