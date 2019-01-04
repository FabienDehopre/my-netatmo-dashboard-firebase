import { Component } from '@angular/core';

import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent {
  constructor(private readonly themeService: ThemeService) {}
}
