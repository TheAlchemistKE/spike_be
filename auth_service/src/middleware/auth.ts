import passport from 'passport';
import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import {UserService} from "../services/user";
import {User} from "../database/models/user";

const userService = new UserService();

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token && await userService.isTokenBlacklisted(token)) {
        return res.status(401).json({ message: 'Token has been blacklisted' });
    }

    passport.authenticate('jwt', { session: false }, (err: Error, user: Express.User, info: any) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        (req as AuthenticatedRequest).user = user as User;
        next();
    })(req, res, next);
};
