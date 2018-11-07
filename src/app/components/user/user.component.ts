import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { UserDisplay } from 'src/app/models/user';
import { FeelLike, PressureUnit, WindUnit, Unit } from '../../models/units';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent {
  @Input()
  user: UserDisplay;

  feelLike(value?: FeelLike): string {
    if (value === FeelLike.humidex) {
      return 'Humidex';
    } else if (value === FeelLike.heatIndex) {
      return 'Heat Index';
    }

    return 'N/A';
  }

  pressureUnit(value?: PressureUnit): string {
    if (value === PressureUnit.mbar) {
      return 'hPa';
    } else if (value === PressureUnit.inHg) {
      return 'inHg';
    } else if (value === PressureUnit.mmHg) {
      return 'mmHg';
    }

    return 'N/A';
  }

  windUnit(value?: WindUnit): string {
    switch (value) {
      case WindUnit.kph:
        return 'Km/h';
      case WindUnit.mph:
        return 'mph';
      case WindUnit.ms:
        return 'm/s';
      case WindUnit.beaufort:
        return 'Beaufort';
      case WindUnit.knot:
        return 'Knots';
    }

    return 'N/A';
  }

  temperatureUnit(value?: Unit): string {
    if (value === Unit.metric) {
      return 'Metric';
    } else if (value === Unit.imperial) {
      return 'Imperial';
    }

    return 'N/A';
  }
}
