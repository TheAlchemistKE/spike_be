import { Request, Response, NextFunction } from 'express';
import { tokenService } from '../config/di';
import {logger} from "../config/logger";

export async function checkTokenExpiration(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.substring(7);

    try {
        if (await tokenService.isTokenBlacklisted(token)) {
            return res.status(401).json({ message: 'Token is blacklisted' });
        }

        if (await tokenService.verifyAndCheckExpiration(token)) {
            next();
        } else {
            res.status(401).json({ message: 'Token has expired' });
        }
    } catch (error) {
        logger.error('Error checking token:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
