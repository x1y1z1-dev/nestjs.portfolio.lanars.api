import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { ServerConfig, ServerConfigName } from '../../configs/server.config';

@Injectable()
export class AppLogger implements LoggerService {
  private logger: winston.Logger;

  constructor(private readonly configService: ConfigService) {
    const serverConfig = this.configService.get<ServerConfig>(ServerConfigName)!;
    const appEnv = join(process.cwd(), serverConfig.appEnv);
    const logDir = join(process.cwd(), 'logs');
    console.log(appEnv);
    const isDev = appEnv !== 'production';

    const transports: winston.transport[] = [
      new winston.transports.DailyRotateFile({
        filename: `${logDir}/app-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        maxFiles: '14d',
        zippedArchive: true,
      }),
    ];

    if (isDev) {
      transports.push(new winston.transports.Console()); // вывод в консоль только в dev
    }

    this.logger = winston.createLogger({
      level: isDev ? 'debug' : 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`),
      ),
      transports,
    });
  }
  log(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace?: string) {
    this.logger.error(`${message} ${trace || ''}`);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }
}