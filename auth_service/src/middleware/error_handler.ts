import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

export default function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    logger.error('Error occurred:', {
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });

    res.status(500).json({
        message: 'An unexpected error occurred',
        error: process.env.NODE_ENV === 'production' ? {} : err
    });
}
