import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { IndoorModuleDevice } from '../../models/device';
import { Units } from '../../models/units';

@Component({
  selector: 'app-indoor-module',
  templateUrl: './indoor-module.component.html',
  styleUrls: ['./indoor-module.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndoorModuleComponent {
  @Input()
  device!: IndoorModuleDevice;

  @Input()
  units!: Units;
}
