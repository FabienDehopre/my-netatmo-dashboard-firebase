import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { InjectorRef } from '../services/injector-ref';
import { LoggerService } from '../services/logger.service';

export function debug<T>(message: string, showOnComplete?: boolean): MonoTypeOperatorFunction<T> {
  const logger = InjectorRef.get(LoggerService);
  return (source: Observable<T>) =>
    source.pipe(
      tap({
        next(val) {
          logger.debug(message, val);
        },
        error(err) {
          logger.error(message, err);
        },
        complete() {
          if (showOnComplete) {
            logger.debug(`${message} [DONE]`);
          }
        },
      })
    );
}
