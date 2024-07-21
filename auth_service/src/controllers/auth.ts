import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import {AuthenticatedRequest, ErrorResponse, SuccessResponse} from '../types';
import {UserService} from "../services/user";
import {logger} from "../config/logger";
import {User} from "../database/models/user";

export class AuthController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    public register = async (req: Request, res: Response) => {
        try {
            const user = await this.userService.register(req.body);
            res.status(201).json({ message: 'User registered successfully', user });
        } catch (error: any) {
            logger.error('Registration error:', error);
            res.status(400).json({ message: error.message });
        }
    };

    public login = (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('local', { session: false }, async (err: Error, user: User, info: { message: string }) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(401).json({ message: info.message });
            }
            const accessToken = this.userService.generateToken(user);
            const refreshToken = await this.userService.generateRefreshToken(user);
            res.status(200).json({ message: 'Login successful', user, accessToken, refreshToken });
        })(req, res, next);
    };

    public refreshToken = async (req: Request, res: Response) => {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token is required' });
        }

        const result = await this.userService.refreshAccessToken(refreshToken);
        if (!result) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        res.status(200).json({
            message: 'Token refreshed successfully',
            user: result.user,
            accessToken: result.accessToken
        });
    };

    public logout = async (req: Request, res: Response<SuccessResponse | ErrorResponse>) => {
        const authenticatedReq = req as AuthenticatedRequest;
        if (!authenticatedReq.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        try {
            await this.userService.logout(authenticatedReq.user);
            const token = req.headers.authorization?.split(' ')[1];
            if (token) {
                const decodedToken: any = jwt.decode(token);

                if (decodedToken && typeof decodedToken.exp === 'number') {
                    const expiresAt = new Date(decodedToken.exp * 1000);
                    await this.userService.blacklistToken(token, expiresAt);
                }
            }
            res.status(200).json({
                message: 'Logout successful'
            });
        } catch (error) {
            logger.error('Logout error:', error); res.status(500).json({ message: 'An error occurred during logout' });
        }
    }
}
