import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, takeUntil, combineLatest, switchMap } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../../models/user';
import { Station } from '../../models/station';
import { Display } from '../../models/display';
import { Device } from '../../models/device';

@Component({
  selector: 'app-station',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.scss'],
})
export class StationComponent implements OnInit, OnDestroy {
  private readonly stop$ = new Subject();
  station$: Observable<Display<Station>>;
  devices$: Observable<Display<Device>[]>;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly afAuth: AngularFireAuth,
    private readonly afs: AngularFirestore
  ) {}

  ngOnInit() {
    this.station$ = this.activatedRoute.paramMap.pipe(
      map(paramMap => paramMap.get('stationId')),
      combineLatest(this.afAuth.user.pipe(map(user => user.uid))),
      switchMap(([stationId, uid]) =>
        this.afs
          .collection('users')
          .doc<User>(uid)
          .collection('stations')
          .doc<Station>(stationId)
          .snapshotChanges()
          .pipe(
            map(snap => {
              const data = snap.payload.data();
              const id = snap.payload.id;
              return { id, ...data };
            })
          )
      ),
      takeUntil(this.stop$)
    );
    this.devices$ = this.activatedRoute.paramMap.pipe(
      map(paramMap => paramMap.get('stationId')),
      combineLatest(this.afAuth.user.pipe(map(user => user.uid))),
      switchMap(([stationId, uid]) =>
        this.afs
          .collection('users')
          .doc<User>(uid)
          .collection('stations')
          .doc<Station>(stationId)
          .collection('devices')
          .snapshotChanges()
          .pipe(
            map(coll =>
              coll.map(doc => {
                const data = doc.payload.doc.data() as Device;
                const id = doc.payload.doc.id;
                return { id, ...data };
              })
            )
          )
      )
    );
  }

  ngOnDestroy(): void {
    this.stop$.next();
    this.stop$.complete();
  }
}
