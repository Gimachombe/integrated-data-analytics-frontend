const winston = require('winston');
const path = require('path');

const logDir = 'logs';

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'data-business-platform' },
  transports: [
    // Write all logs with importance level of 'error' or less to error.log
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
    }),
    // Write all logs with importance level of 'info' or less to combined.log
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
    }),
    // Console output in development
    ...(process.env.NODE_ENV !== 'production'
      ? [
          new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
          }),
        ]
      : []),
  ],
});

module.exports = logger;
