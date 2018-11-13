import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-station',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.scss'],
})
export class StationComponent implements OnInit, OnDestroy {
  private readonly stop$ = new Subject();

  constructor(private readonly activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.paramMap
      .pipe(
        map(x => x.get('stationId')),
        takeUntil(this.stop$)
      )
      .subscribe(x => console.log(x));
  }

  ngOnDestroy(): void {
    this.stop$.next();
  }
}
