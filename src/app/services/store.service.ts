import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, first, map } from 'rxjs/operators';

import { AuthorizeDialogComponent } from '../components/authorize-dialog/authorize-dialog.component';
import { NetatmoAuthorization } from '../models/netatmo-authorization';
import { Station, StationVM } from '../models/station';
import { Units } from '../models/units';
import { User } from '../models/user';

import { NetatmoService } from './netatmo.service';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  constructor(
    private readonly afs: AngularFirestore,
    private readonly netatmoService: NetatmoService,
    private readonly matDialog: MatDialog,
    private readonly router: Router
  ) {}

  ensureNetatmoConnected(uid: string): void {
    this.afs
      .collection('users')
      .doc<User>(uid)
      .snapshotChanges()
      .pipe(first())
      .subscribe(snapshot => {
        if (!snapshot.payload.exists || snapshot.payload.data().refresh_token == null) {
          const netatmoAuthorizationUrl = this.netatmoService.buildAuthorizationUrl();
          this.openAuthorizeDialog(netatmoAuthorizationUrl);
        }
      });
  }

  createUser(uid: string, authorization: NetatmoAuthorization): Promise<void> {
    return this.afs
      .collection('users')
      .doc(uid)
      .set(
        {
          enabled: true,
          access_token: authorization.access_token,
          expires_at: new Date(Date.now() + authorization.expires_in * 1000).valueOf(),
          refresh_token: authorization.refresh_token,
        },
        { merge: true }
      );
  }

  getUnits(uid: string): Observable<Units | null> {
    return this.afs
      .collection('users')
      .doc<User>(uid)
      .valueChanges()
      .pipe(
        filter(user => user != null && user.refresh_token != null),
        map(user => user.units || null)
      );
  }

  getStations(uid: string): Observable<StationVM[]> {
    return this.afs
      .collection('users')
      .doc(uid)
      .collection<Station>('stations')
      .snapshotChanges()
      .pipe(
        map(arr =>
          arr.map(snap => {
            const data = snap.payload.doc.data();
            const id = snap.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  private openAuthorizeDialog(authorizeUrl: string): void {
    const dialogRef = this.matDialog.open(AuthorizeDialogComponent, {
      closeOnNavigation: true,
      data: authorizeUrl,
      disableClose: true,
      hasBackdrop: true,
      role: 'alertdialog',
      width: '400px',
    });
    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe(result => {
        if (result === false) {
          this.router.navigate(['/logout']);
        }
      });
  }
}
