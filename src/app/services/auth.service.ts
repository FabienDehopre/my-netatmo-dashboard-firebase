import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { AuthUser } from '../models/auth-user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly user$: Observable<AuthUser>;

  constructor(private readonly afAuth: AngularFireAuth) {
    this.user$ = this.afAuth.user.pipe(
      filter(u => u != null),
      map(u => ({ uid: u.uid, name: u.displayName, email: u.emailVerified ? u.email : null, avatar: u.photoURL }))
    );
  }

  signOut(): void {
    this.afAuth.auth.signOut();
  }
}
