export type LogLevel = 'OFF' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

// eslint-disable-next-line no-shadow
enum LogLevelEnum {
  OFF = -1,
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface Logger {
  debug(message: string): void;
  info(message: string): void;
  green(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

export class HatchetLogger implements Logger {
  private logLevel: LogLevel;
  private context: string;

  constructor(context: string, logLevel: LogLevel = 'INFO') {
    this.logLevel = logLevel;
    this.context = context;
  }

  private log(level: LogLevel, message: string, color?: string): void {
    if (LogLevelEnum[level] >= LogLevelEnum[this.logLevel]) {
      const time = new Date().toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      // eslint-disable-next-line no-console
      console.log(
        `🪓 ${process.pid} | ${time} ${color && `\x1b[${color}m`} [${level}/${this.context}] ${message}\x1b[0m`
      );
    }
  }

  debug(message: string): void {
    this.log('DEBUG', message, '35');
  }

  info(message: string): void {
    this.log('INFO', message);
  }

  green(message: string): void {
    this.log('INFO', message, '32');
  }

  warn(message: string): void {
    this.log('WARN', message, '93');
  }

  error(message: string): void {
    this.log('ERROR', message, '91');
  }
}

export default HatchetLogger;
