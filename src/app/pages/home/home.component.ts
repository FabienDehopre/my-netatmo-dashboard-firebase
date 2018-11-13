import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, throwError, Subject } from 'rxjs';
import { catchError, map, switchMap, tap, mergeMap, first, filter, takeUntil } from 'rxjs/operators';
import { User, UserDisplay } from '../../models/user';
import { NetatmoService } from '../../services/netatmo.service';
import { Station, StationDisplay } from '../../models/station';
import { MatDialog } from '@angular/material/dialog';
import { AuthorizeDialogComponent } from '../../components/authorize-dialog/authorize-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  user$: Observable<UserDisplay>;
  stations$: Observable<StationDisplay[]>;
  authorizeError: string | null = null;
  selectedStation: Station;
  private readonly logoutSubject = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly afAuth: AngularFireAuth,
    private readonly afs: AngularFirestore,
    private readonly activatedRoute: ActivatedRoute,
    private readonly netatomService: NetatmoService
  ) {}

  ngOnInit() {
    this.authorizeError = null;
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
      this.user$ = this.afAuth.user.pipe(
        filter(user => user != null),
        switchMap(({ uid, displayName, photoURL }) =>
          this.afs
            .collection('users')
            .doc<User>(uid)
            .valueChanges()
            .pipe(
              map(user => ({ ...user, uid, displayName, photoURL })),
              takeUntil(this.logoutSubject)
            )
        ),
        tap(user => {
          if (user == null || user.refresh_token == null) {
            const netatmoAuthorizeUrl = this.netatomService.buildAuthorizationUrl();
            this.openAuthorizeDialog(netatmoAuthorizeUrl);
          }
        }),
        catchError(err => {
          console.error('An error occurred while fetching data from firestore:', err);
          return of(null);
        })
      );
      this.stations$ = this.user$.pipe(
        switchMap(user =>
          this.afs
            .collection<User>('users')
            .doc(user.uid)
            .collection<Station>('stations')
            .snapshotChanges()
            .pipe(
              map(arr =>
                arr.map(snap => {
                  const data = snap.payload.doc.data();
                  const id = snap.payload.doc.id;
                  return { id, ...data };
                })
              ),
              takeUntil(this.logoutSubject)
            )
        )
      );
    }
  }

  async logout(): Promise<void> {
    this.logoutSubject.next();
    await this.afAuth.auth.signOut();
    await this.router.navigate(['/']);
  }

  async enableSync(uid: string): Promise<void> {
    await this.afs
      .collection('users')
      .doc<User>(uid)
      .update({ enabled: true });
  }

  async disableSync(uid: string): Promise<void> {
    await this.afs
      .collection('users')
      .doc<User>(uid)
      .update({ enabled: false });
  }

  openAuthorizeDialog(authorizeUrl: string): void {
    const dialogRef = this.dialog.open(AuthorizeDialogComponent, {
      width: '250px',
      hasBackdrop: true,
      closeOnNavigation: true,
      data: authorizeUrl,
    });
    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe(result => {
        if (result === false) {
          this.logout();
        }
      });
  }
}
