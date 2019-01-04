import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2 } from '@angular/core';

const THEME_KEY = 'MyNetatmoDashboardTheme';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  get isLightTheme(): boolean {
    const isLightThemeFromStorage = localStorage.getItem(THEME_KEY);
    if (isLightThemeFromStorage != null) {
      const isLightTheme = JSON.parse(isLightThemeFromStorage);
      return isLightTheme;
    } else {
      return false;
    }
  }

  get isDarkTheme(): boolean {
    return !this.isLightTheme;
  }

  constructor(@Inject(DOCUMENT) private readonly document: Document) {
    this.applyTheme(this.isLightTheme);
  }

  setTheme(isLightTheme: boolean): void {
    localStorage.setItem(THEME_KEY, JSON.stringify(isLightTheme));
    this.applyTheme(isLightTheme);
  }

  private applyTheme(isLightTheme: boolean): void {
    if (isLightTheme) {
      this.document.body.classList.add('theme-alternate');
    } else {
      this.document.body.classList.remove('theme-alternate');
    }
  }
}
