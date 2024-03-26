import winston from 'winston';
import WinstonDailyRotate from 'winston-daily-rotate-file';
import { SERVER_LOGGER_CONFIG } from '../configs/loggers.js';

const transport = new WinstonDailyRotate({
  filename: `${SERVER_LOGGER_CONFIG.fileName}-%DATE%.log`,
  dirname: SERVER_LOGGER_CONFIG.logDir,
  datePattern: 'DD-MM-YYYY',
  maxFiles: SERVER_LOGGER_CONFIG.maxFiles,
});

const SERVER_LOGGER = winston.createLogger({
  level: SERVER_LOGGER_CONFIG.level,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'DD-MM-YYYY hh:mm:ss A' }),
    winston.format.json()
  ),
  transports: [transport],
});

if (process.env.NODE_ENV !== 'PROD') {
  SERVER_LOGGER.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

export default SERVER_LOGGER;
