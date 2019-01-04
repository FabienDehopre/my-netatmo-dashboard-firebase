import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';

import { StationMenuItem, StationVM } from '../../models/station';
import { Units } from '../../models/units';
import { untilComponentDestroyed } from '../../rxjs-operators/until-component-destroyed';
import { AuthService } from '../../services/auth.service';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy {
  units$: Observable<Units>;
  station$: Observable<StationVM | null>;
  stationMenuItems$: Observable<StationMenuItem[]>;
  selectedStationId: string | null = null;

  constructor(private readonly authService: AuthService, readonly storeService: StoreService, cdr: ChangeDetectorRef) {
    this.units$ = this.authService.user$.pipe(
      map(user => user.uid),
      switchMap(uid => this.storeService.getUnits(uid)),
      filter(unit => unit != null)
    );
    const stations$ = this.authService.user$.pipe(
      map(user => user.uid),
      switchMap(uid => this.storeService.getStations(uid)),
      filter(stations => stations != null)
    );
    this.stationMenuItems$ = stations$.pipe(
      map(stations => stations.map(s => ({ id: s.id, name: s.name }))),
      tap(stations => {
        if (this.selectedStationId == null && stations.length > 0) {
          this.selectedStationId = stations[0].id;
          cdr.markForCheck();
        }
      })
    );
    this.station$ = stations$.pipe(map(stations => stations.find(s => s.id === this.selectedStationId)));
  }

  ngOnInit(): void {
    this.authService.user$
      .pipe(
        map(user => user.uid),
        distinctUntilChanged(),
        untilComponentDestroyed(this)
      )
      .subscribe(uid => this.storeService.ensureNetatmoConnected(uid));
  }

  ngOnDestroy(): void {}

  stationSelected(id: string): void {
    this.selectedStationId = id;
  }
}
