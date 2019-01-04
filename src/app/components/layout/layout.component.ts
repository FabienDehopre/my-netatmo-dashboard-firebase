import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { StationMenuItem } from '../../models/station';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  @Input()
  stations: StationMenuItem[] = [];

  @Input()
  selectedStationId: string | null = null;

  @Output()
  stationSelected = new EventEmitter<string>();

  constructor(readonly themeService: ThemeService, readonly userService: AuthService) {}

  setTheme(isLightTheme: boolean): void {
    this.themeService.setTheme(isLightTheme);
  }

  selectStation(id: string): void {
    this.stationSelected.emit(id);
  }
}
