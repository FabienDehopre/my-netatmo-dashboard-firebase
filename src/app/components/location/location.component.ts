import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Location } from '../../models/location';
import { Units } from '../../models/units';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationComponent {
  @Input()
  location!: Location;

  @Input()
  units!: Units;
}
