import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { StationVM } from '../../models/station';
import { Units } from '../../models/units';

@Component({
  selector: 'app-station',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StationComponent {
  @Input()
  station: StationVM | null = null;

  @Input()
  units: Units | null = null;
}
