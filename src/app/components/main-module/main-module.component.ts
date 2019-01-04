import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { MainDevice } from '../../models/device';
import { Units } from '../../models/units';

@Component({
  selector: 'app-main-module',
  templateUrl: './main-module.component.html',
  styleUrls: ['./main-module.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainModuleComponent {
  @Input()
  device!: MainDevice;

  @Input()
  units!: Units;
}
