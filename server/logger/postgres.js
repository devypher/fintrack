import winston from 'winston';
import WinstonDailyRotate from 'winston-daily-rotate-file';
import { POSTGRES_LOGGER_CONFIG } from '../configs/loggers.js';

const transport = new WinstonDailyRotate({
  filename: `${POSTGRES_LOGGER_CONFIG.fileName}-%DATE%.log`,
  dirname: POSTGRES_LOGGER_CONFIG.logDir,
  datePattern: 'DD-MM-YYYY',
  maxFiles: POSTGRES_LOGGER_CONFIG.maxFiles,
});

const POSTGRES_LOGGER = winston.createLogger({
  level: POSTGRES_LOGGER_CONFIG.level,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'DD-MM-YYYY hh:mm:ss A' }),
    winston.format.json()
  ),
  transports: [transport],
});

export default POSTGRES_LOGGER;
