import winston from 'winston';
import * as path from 'path';
import { createLogger, transports, format } from "winston";

const logger = createLogger({
  level: 'info',
  transports: [
    new winston.transports.File({
        filename: path.join('logs', 'combined.log'),
      }),
      // Errors go to a separate error.log
      new winston.transports.File({
        filename: path.join('logs', 'error.log'),
        level: 'error',
      }),
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.splat(),
        format.simple()
      )
    })
  ]
});


export { logger }