import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-wifi',
  templateUrl: './wifi.component.html',
  styleUrls: ['./wifi.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WifiComponent {
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

    const level = Math.max(56, Math.min(86, value));
    if (level < 61) {
      this.svgIcon = 'wifi-strength-4';
      this.cssClass = 'app-wifi--excellent';
      this.tooltip = 'Excellent signal';
    } else if (level < 68) {
      this.svgIcon = 'wifi-strength-3';
      this.cssClass = 'app-wifi--good';
      this.tooltip = 'Good signal';
    } else if (level < 75) {
      this.svgIcon = 'wifi-strength-2';
      this.cssClass = 'app-wifi--medium';
      this.tooltip = 'Low signal';
    } else if (level < 82) {
      this.svgIcon = 'wifi-strength-1';
      this.cssClass = 'app-wifi--low';
      this.tooltip = 'Very low signal';
    } else {
      this.svgIcon = 'wifi-strength-outline';
      this.cssClass = 'app-wifi--unstable';
      this.tooltip = 'No signal';
    }
  }
}
