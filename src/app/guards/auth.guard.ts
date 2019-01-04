import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { CanActivateChild, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { LoggerService } from '../services/logger.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivateChild {
  constructor(private readonly afAuth: AngularFireAuth, private readonly router: Router, private readonly logger: LoggerService) {}

  canActivateChild(): Observable<boolean | UrlTree> {
    return this.afAuth.user.pipe(
      map(u => u != null && !u.isAnonymous),
      map(res => res || this.router.createUrlTree(['/login'])),
      tap(res => this.logger.debug('auth guard result', res))
    );
  }
}
