import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { NetatmoAuthorization } from '../../models/netatmo-authorization';
import { User } from '../../models/user';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss'],
})
export class CallbackComponent implements OnInit {
  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly http: HttpClient,
    private readonly afAuth: AngularFireAuth,
    private readonly afs: AngularFirestore
  ) {}

  ngOnInit() {
    combineLatest(
      this.activatedRoute.queryParamMap.pipe(
        map(queryParamMap => [queryParamMap.get('state'), queryParamMap.get('code'), queryParamMap.get('error')]),
        tap(([state, code, error]) => {
          const sessionStorageState = sessionStorage.getItem('netatmo_state');
          sessionStorage.removeItem('netatmo_state');
          if (error != null) {
            throw new Error(error);
          } else if (state !== sessionStorageState) {
            throw new Error('invalid_state');
          }
        }),
        map(([_, code]) =>
          new HttpParams()
            .set('grant_type', 'authorization_code')
            .set('client_id', environment.netatmo.clientId)
            .set('client_secret', environment.netatmo.clientSecret)
            .set('code', code)
            .set('redirect_uri', 'http://localhost:4200/callback')
            .set('scope', 'read_station')
        ),
        switchMap(body =>
          this.http.post<NetatmoAuthorization>('https://api.netatmo.com/oauth2/token', body.toString(), {
            headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8'),
          })
        )
      ),
      this.afAuth.user.pipe(map(user => user.uid))
    ).subscribe(
      ([authCode, uid]) => {
        this.afs
          .collection('users')
          .doc<User>(uid)
          .set(
            {
              uid,
              access_token: authCode.access_token,
              expires_at: new Date(Date.now() + authCode.expires_in * 1000).valueOf(),
              refresh_token: authCode.refresh_token,
            },
            { merge: true }
          );
        this.router.navigate(['/dashboard']);
      },
      err => {
        let error: string;
        if (typeof err === 'string') {
          error = err;
        } else if (err instanceof Error) {
          error = err.message;
        } else {
          error = 'unkown_error';
          console.error('Unknown callback error:', err);
        }

        this.router.navigate(['/dashboard'], { queryParams: { error } });
      }
    );
  }
}
