import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { from } from 'rxjs';
import { first, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { CallbackErrorDialogComponent } from '../../components/callback-error-dialog/callback-error-dialog.component';
import { debug } from '../../rxjs-operators/debug';
import { AuthService } from '../../services/auth.service';
import { FunctionsService } from '../../services/functions.service';
import { LoggerService } from '../../services/logger.service';
import { NetatmoService } from '../../services/netatmo.service';
import { StoreService } from '../../services/store.service';

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
    private readonly authService: AuthService,
    private readonly storeService: StoreService,
    private readonly functionsService: FunctionsService,
    private readonly loggerservice: LoggerService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParamMap
      .pipe(
        map(paramMap => [paramMap.get('state'), paramMap.get('code'), paramMap.get('error')]),
        debug('Returned from netatmo authorization page'),
        switchMap(([state, code, error]) => this.netatmoService.exchangeCodeForAccessToken(state, code, error)),
        debug('Result of exchanging the code for an access token and refresh token'),
        withLatestFrom(this.authService.user$),
        switchMap(([authCode, user]) => from(this.storeService.createUser(user.uid, authCode))),
        debug('User has been created in firestore'),
        switchMap(() => this.functionsService.fetchAndUpdateFirstWeatherData()),
        debug('First weather data has been fetched from netatmo. Number of station(s) retrieved:'),
        first()
      )
      .subscribe(
        () => this.router.navigate(['/']),
        error => {
          this.loggerservice.error('An error occurred while authorizing netatmo access', error);
          let message: string;
          if (typeof error === 'string') {
            message = error;
          } else if (error instanceof Error) {
            message = error.message;
          } else {
            message = 'unknown_error';
          }

          const dialogRef = this.dialog.open(CallbackErrorDialogComponent, {
            closeOnNavigation: true,
            data: {
              message,
              error,
            },
            disableClose: true,
            hasBackdrop: true,
            role: 'alertdialog',
            width: '400px',
          });
          dialogRef
            .afterClosed()
            .pipe(first())
            .subscribe(() => this.router.navigate(['/logout']));
        }
      );
  }
}
