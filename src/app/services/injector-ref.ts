import { Injectable, InjectionToken, Injector, Type } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class InjectorRef {
  private static injector: Injector | null = null;

  static get<T>(token: Type<T> | InjectionToken<T>): T {
    if (InjectorRef.injector == null) {
      throw new Error('InjectorRef has not been initialized yet.');
    }

    return InjectorRef.injector.get<T>(token);
  }

  constructor(private readonly injector: Injector) {
    InjectorRef.injector = this.injector;
  }
}
