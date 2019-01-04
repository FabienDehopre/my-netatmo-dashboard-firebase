import { Injectable } from '@angular/core';

import { LogLevel } from '../models/log-level';

// tslint:disable:no-console

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private level = LogLevel.off;

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  clear(): void {
    console.clear();
  }

  trace(message: string, ...optionalParams: any[]): void {
    if (this.level <= LogLevel.trace) {
      console.trace(this.timestampMessage(message), ...optionalParams);
    }
  }

  debug(message: string, ...optionalParams: any[]): void {
    if (this.level <= LogLevel.debug) {
      console.debug(this.timestampMessage(message), ...optionalParams);
    }
  }

  info(message: string, ...optionalParams: any[]): void {
    if (this.level <= LogLevel.info) {
      console.info(this.timestampMessage(message), ...optionalParams);
    }
  }

  warn(message: string, ...optionalParams: any[]): void {
    if (this.level <= LogLevel.warn) {
      console.warn(this.timestampMessage(message), ...optionalParams);
    }
  }

  error(message: string, ...optionalParams: any[]): void {
    if (this.level <= LogLevel.error) {
      console.error(this.timestampMessage(message), ...optionalParams);
    }
  }

  private timestampMessage(message: string): string {
    // TODO?: add style ???
    const now = new Date(Date.now());
    return `[${now.getUTCDate()}/${now.getUTCMonth() +
      1}/${now.getUTCFullYear()} ${now.getUTCHours()}:${now.getUTCMinutes()}:${now.getUTCSeconds()}.${now.getUTCMilliseconds()}] ${message}`;
  }
}
