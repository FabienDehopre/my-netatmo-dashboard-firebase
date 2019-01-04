import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { RainGaugeModuleDevice } from '../../models/device';
import { Units } from '../../models/units';

@Component({
  selector: 'app-rain-gauge-module',
  templateUrl: './rain-gauge-module.component.html',
  styleUrls: ['./rain-gauge-module.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RainGaugeModuleComponent {
  @Input()
  device!: RainGaugeModuleDevice;

  @Input()
  units!: Units;
}
