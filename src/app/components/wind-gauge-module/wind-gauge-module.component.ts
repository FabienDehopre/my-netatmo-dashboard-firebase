import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { WindGaugeModuleDevice } from '../../models/device';
import { Units } from '../../models/units';

@Component({
  selector: 'app-wind-gauge-module',
  templateUrl: './wind-gauge-module.component.html',
  styleUrls: ['./wind-gauge-module.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WindGaugeModuleComponent {
  @Input()
  device!: WindGaugeModuleDevice;

  @Input()
  units!: Units;
}
