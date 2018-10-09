import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { User } from '../../models/user';
import { NetatmoService } from '../../services/netatmo.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss'],
})
export class CallbackComponent implements OnInit {
  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly netatmoService: NetatmoService,
    private readonly afAuth: AngularFireAuth,
    private readonly afs: AngularFirestore
  ) {}

  ngOnInit() {
    combineLatest(
      this.activatedRoute.queryParamMap.pipe(
        map(queryParamMap => [queryParamMap.get('state'), queryParamMap.get('code'), queryParamMap.get('error')]),
        switchMap(([state, code, error]) => this.netatmoService.exchangeCodeForAccessToken(state, code, error))
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
