import { OnDestroy } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface WithOnDestroy extends OnDestroy {
  componentDestroyed?: Observable<true>;
}

export function componentDestroyed(component: WithOnDestroy): Observable<true> {
  if (component.componentDestroyed) {
    return component.componentDestroyed;
  }

  if (typeof component.ngOnDestroy !== 'function') {
    throw new Error('The component must implements the OnDestroy interface.');
  }

  const onDestroy = component.ngOnDestroy;
  const stop$ = new ReplaySubject<true>();

  component.ngOnDestroy = () => {
    onDestroy.apply(component);
    stop$.next(true);
    stop$.complete();
  };

  return (component.componentDestroyed = stop$.asObservable());
}

export function untilComponentDestroyed<T>(component: WithOnDestroy): (source: Observable<T>) => Observable<T> {
  return (source: Observable<T>) => source.pipe(takeUntil(componentDestroyed(component)));
}
