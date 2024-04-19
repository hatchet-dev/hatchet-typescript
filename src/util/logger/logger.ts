export type LogLevel = 'OFF' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

// eslint-disable-next-line no-shadow
enum LogLevelEnum {
  OFF = -1,
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export class Logger {
  private logLevel: LogLevel;
  private context: string;

  constructor(context: string, logLevel: LogLevel = 'INFO') {
    this.logLevel = logLevel;
    this.context = context;
  }

  private log(level: LogLevel, message: string, color: string = '33'): void {
    if (LogLevelEnum[level] >= LogLevelEnum[this.logLevel]) {
      console.log(`🪓 \x1b[${color}m [${level}/${this.context}] ${message}\x1b[0m`);
    }
  }

  debug(message: string): void {
    this.log('DEBUG', message, '35');
  }

  info(message: string): void {
    this.log('INFO', message, '30');
  }

  warn(message: string): void {
    this.log('WARN', message, '93');
  }

  error(message: string): void {
    this.log('ERROR', message, '91');
  }
}

export default Logger;
