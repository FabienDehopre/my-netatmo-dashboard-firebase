import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, filter, first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private readonly afAuth: AngularFireAuth, private activatedRoute: ActivatedRoute, private readonly router: Router) {}

  ngOnInit() {
    this.afAuth.user
      .pipe(
        filter(u => u != null && !u.isAnonymous),
        combineLatest(this.activatedRoute.queryParamMap),
        first()
      )
      .subscribe(([user, queryParamsMap]) => {
        const returnTo = queryParamsMap.has('returnTo') ? queryParamsMap.get('returnTo') : '/';
        console.log('UID', user.uid);
        this.router.navigateByUrl(returnTo);
      });
  }

  login(): void {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }
}
