export const POSTGRES_LOGGER_CONFIG = {
  level: process.env.NODE_ENV === 'PROD' ? 'info' : 'debug',
  fileName: 'postgres',
  logDir: 'logs',
  maxFiles: process.env.NODE_ENV === 'PROD' ? '15d' : '2d',
};

export const SERVER_LOGGER_CONFIG = {
  level: process.env.NODE_ENV === 'PROD' ? 'info' : 'debug',
  fileName: 'server',
  logDir: 'logs',
  maxFiles: process.env.NODE_ENV === 'PROD' ? '15d' : '2d',
};
