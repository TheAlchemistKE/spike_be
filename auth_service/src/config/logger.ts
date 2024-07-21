import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import config from './env';

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
});

// Create the logger
const logger = winston.createLogger({
    level: config.logging.level,
    format: combine(
        errors({ stack: true }), // Include stack traces
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    transports: [
        // Console transport
        new winston.transports.Console({
            format: combine(
                colorize(),
                logFormat
            ),
        }),
        // Rotating file transport for error logs
        new DailyRotateFile({
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            level: 'error',
        }),
        // Rotating file transport for all logs
        new DailyRotateFile({
            filename: 'logs/combined-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
        }),
    ],
    exitOnError: false, // Do not exit on handled exceptions
});

// If we're not in production, log to the console with colors
if (config.env !== 'production') {
    logger.add(new winston.transports.Console({
        format: combine(
            colorize(),
            logFormat
        ),
    }));
}

// Create a stream object with a 'write' function that will be used by morgan
const stream = {
    write: (message: string) => {
        logger.info(message.trim());
    },
};

export { logger, stream };
