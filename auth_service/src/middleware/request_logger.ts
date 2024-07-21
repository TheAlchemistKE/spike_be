import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
    logger.info('Incoming request', {
        method: req.method,
        path: req.path,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });
    next();
}
