export enum LogLevel {
  all = 0,
  trace = 5000,
  debug = 10000,
  info = 20000,
  warn = 30000,
  error = 40000,
  off = 9007199254740991,
}

export type LogLevelType = 'OFF' | 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'TRACE' | 'ALL';

export function convertToLogLevel(type: LogLevelType): LogLevel {
  switch (type) {
    case 'OFF':
      return LogLevel.off;
    case 'ERROR':
      return LogLevel.error;
    case 'WARN':
      return LogLevel.warn;
    case 'INFO':
      return LogLevel.info;
    case 'DEBUG':
      return LogLevel.debug;
    case 'TRACE':
      return LogLevel.trace;
    case 'ALL':
      return LogLevel.all;
    default:
      throw new TypeError('Invalid LogLevelType value');
  }
}
