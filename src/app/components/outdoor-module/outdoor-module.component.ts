import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { OutdoorModuleDevice } from '../../models/device';
import { Units } from '../../models/units';

@Component({
  selector: 'app-outdoor-module',
  templateUrl: './outdoor-module.component.html',
  styleUrls: ['./outdoor-module.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OutdoorModuleComponent {
  @Input()
  device!: OutdoorModuleDevice;

  @Input()
  units!: Units;
}
