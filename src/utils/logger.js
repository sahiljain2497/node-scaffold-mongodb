const winston = require('winston');
const appRoot = require('app-root-path');

// const levels = { error: 0,
//   warn: 1,
//   info: 2,
//   http: 3,
//   verbose: 4,
//   debug: 5,
//   silly: 6,
// };

// Create a logger based on the log level in config.json
const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      level: process.env.LOG_LEVEL,
      filename: `${appRoot}/logs/app.log`,
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  ],
  exitOnError: false,
});

logger.stream = {
  // Write the text in 'message' to the log.
  write: (message) => {
    // Removes double newline issue with piping morgan server request
    // log through winston logger.
    logger.info(message.length > 0 ? message.substring(0, message.length - 1) : message);
  },
};

module.exports = logger;
