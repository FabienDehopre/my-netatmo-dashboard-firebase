import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioComponent {
  svgIcon: string | null = null;
  cssClass: string | null = null;
  tooltip: string | null = null;

  @Input()
  set value(value: number | null) {
    if (value == null) {
      this.svgIcon = null;
      this.cssClass = null;
      this.tooltip = null;
      return;
    }

    const level = Math.max(60, Math.min(90, value));
    if (level < 65) {
      this.svgIcon = 'network-strength-4';
      this.cssClass = 'app-radio--excellent';
      this.tooltip = 'Excellent signal';
    } else if (level < 72) {
      this.svgIcon = 'network-strength-3';
      this.cssClass = 'app-radio--good';
      this.tooltip = 'Good signal';
    } else if (level < 79) {
      this.svgIcon = 'network-strength-2';
      this.cssClass = 'app-radio--medium';
      this.tooltip = 'Low signal';
    } else if (level < 86) {
      this.svgIcon = 'network-strength-1';
      this.cssClass = 'app-radio--low';
      this.tooltip = 'Very low signal';
    } else {
      this.svgIcon = 'network-strength-outline';
      this.cssClass = 'app-radio--unstable';
      this.tooltip = 'No signal';
    }
  }
}
