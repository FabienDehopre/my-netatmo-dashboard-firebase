import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Battery } from '../../models/battery';

@Component({
  selector: 'app-battery',
  templateUrl: './battery.component.html',
  styleUrls: ['./battery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BatteryComponent {
  svgIcon: string | null = null;
  cssClass: string | null = null;
  percent!: number;

  @Input()
  set value(value: Battery | null) {
    if (value == null) {
      this.svgIcon = null;
      this.cssClass = null;
      return;
    }

    this.percent = value.percent;
    const level = Math.max(0, Math.min(100, Math.round(value.percent / 10) * 10));
    if (level === 0) {
      this.svgIcon = 'battery-outline';
      this.cssClass = 'app-battery--level0';
    } else if (level === 100) {
      this.svgIcon = 'battery';
      this.cssClass = 'app-battery--level100';
    } else {
      this.svgIcon = `battery-${level}`;
      this.cssClass = `app-battery--level${level}`;
    }
  }
}
