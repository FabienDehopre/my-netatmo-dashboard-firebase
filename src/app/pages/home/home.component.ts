import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { User } from '../../models/user';
import { NetatmoService } from '../../services/netatmo.service';

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
    private readonly netatomService: NetatmoService
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
            this.netatmoAuthorize = this.netatomService.buildAuthorizationUrl();
          }
        }),
        switchMap(user => {
          if (user != null && user.expires_at <= Date.now() && user.refresh_token != null) {
            console.log('refresh netatmo access token using refresh token');
            return this.netatomService.refreshAccessToken(user.refresh_token).pipe(
              map(
                res => ({
                  access_token: res.access_token,
                  expires_at: new Date(Date.now() + res.expires_in * 1000).valueOf(),
                  refresh_token: res.refresh_token,
                  uid: user.uid,
                }),
                tap((newUser: User) => {
                  console.log('updating user in firestore', newUser);
                  this.afs
                    .collection('users')
                    .doc<User>(user.uid)
                    .set(newUser, { merge: true });
                })
              )
            );
          } else if (user != null && user.refresh_token == null) {
            return throwError('Cannot refresh netatmo access token because the refresh token does not exist.');
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
