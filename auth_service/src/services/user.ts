import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { validate } from 'class-validator';
import { UserPayload } from '../types';
import {UserRepository} from "../database/repositories/user";
import {BlacklistedTokenRepository} from "../database/repositories/blacklisted_token";
import {User} from "../database/models/user";
import {logger} from "../config/logger";

export class UserService {
    private userRepository: UserRepository;
    private blacklistedTokenRepository: BlacklistedTokenRepository;

    constructor() {
        this.userRepository = new UserRepository();
        this.blacklistedTokenRepository = new BlacklistedTokenRepository();
    }

    async register(userData: Partial<User>): Promise<User> {
        try {
            const user = new User();
            Object.assign(user, userData);

            const errors = await validate(user);
            if (errors.length > 0) {
                throw new Error(`Validation failed: ${errors.toString()}`);
            }

            const existingUser = await this.userRepository.findByEmail(user.email);
            if (existingUser) {
                throw new Error('User with this email already exists');
            }

            const hashedPassword = await bcrypt.hash(user.password, 10);
            user.password = hashedPassword;

            return await this.userRepository.create(user);
        } catch (error) {
            logger.error('Error registering user:', error);
            throw error;
        }
    }

    async validateUser(email: string, password: string): Promise<User | null> {
        try {
            const user = await this.userRepository.findByEmail(email);
            if (!user) {
                return null;
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return null;
            }

            return user;
        } catch (error) {
            logger.error('Error validating user:', error);
            throw error;
        }
    }

    generateToken(user: User): string {
        const payload: UserPayload = {
            id: user.id,
            email: user.email,
            role: user.role
        };
        return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });
    }

    async generateRefreshToken(user: User): Promise<string> {
        const refreshToken = uuidv4();
        user.refresh_token = refreshToken;
        await this.userRepository.update(user.id, { refresh_token: refreshToken });
        return refreshToken;
    }

    async refreshAccessToken(refreshToken: string): Promise<{ user: User; accessToken: string } | null> {
        const user = await this.userRepository.findByRefreshToken(refreshToken);
        if (!user) {
            return null;
        }
        const accessToken = this.generateToken(user);
        return { user, accessToken };
    }

    async logout(user: User): Promise<void> {
        // @ts-ignore
        await this.userRepository.update(user.id, { refresh_token: null });
    }

    async blacklistToken(token: string, expiresAt: Date): Promise<void> {
        await this.blacklistedTokenRepository.create(token, expiresAt);
    }

    async isTokenBlacklisted(token: string): Promise<boolean> {
        const blacklistedToken = await this.blacklistedTokenRepository.findByToken(token);
        return !!blacklistedToken;
    }

    async removeExpiredBlacklistedTokens(): Promise<void> {
        await this.blacklistedTokenRepository.removeExpired();
    }

    async getUserById(id: string): Promise<User | null> {
        try {
            return await this.userRepository.findById(id);
        } catch (error) {
            logger.error('Error fetching user:', error);
            throw error;
        }
    }

    async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
        try {
            if (userData.password) {
                userData.password = await bcrypt.hash(userData.password, 10);
            }
            return await this.userRepository.update(id, userData);
        } catch (error) {
            logger.error('Error updating user:', error);
            throw error;
        }
    }

    async deleteUser(id: string): Promise<boolean> {
        try {
            return await this.userRepository.delete(id);
        } catch (error) {
            logger.error('Error deleting user:', error);
            throw error;
        }
    }

    async verifyUser(id: string): Promise<User | null> {
        try {
            return await this.userRepository.update(id, { is_verified: true });
        } catch (error) {
            logger.error('Error verifying user:', error);
            throw error;
        }
    }
}
