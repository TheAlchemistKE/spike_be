import { Repository, LessThan } from 'typeorm';
import jwt from 'jsonwebtoken';
import config from "../config/env";
import { logger } from "../config/logger";
import { BlacklistedToken } from "../database/models/blacklisted_tokens";

interface TokenPayload {
    userId: string;
    exp: number;
}

export class TokenService {
    constructor(private blacklistedTokensRepository: Repository<BlacklistedToken>) {}

    generateToken(userId: string): string {
        return jwt.sign({ userId }, config.security.jwtSecret, { expiresIn: config.security.jwtExpiresIn });
    }

    generateRefreshToken(userId: string): string {
        return jwt.sign({ userId }, config.security.refreshTokenSecret, { expiresIn: config.security.refreshTokenExpiresIn });
    }

    async verifyAndCheckExpiration(token: string): Promise<boolean> {
        try {
            jwt.verify(token, config.security.jwtSecret) as TokenPayload;
            const isBlacklisted = await this.isTokenBlacklisted(token);
            return !isBlacklisted;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                await this.blacklistToken(token);
            } else {
                logger.error('Error verifying token:', error);
            }
            return false;
        }
    }

    async blacklistToken(token: string): Promise<void> {
        try {
            const decoded = jwt.decode(token) as TokenPayload;
            if (!decoded || typeof decoded.exp !== 'number') {
                throw new Error('Invalid token');
            }

            const expiredAt = new Date(decoded.exp * 1000);
            const blacklistedToken = this.blacklistedTokensRepository.create({
                token,
                expires_at: expiredAt,
            });
            await this.blacklistedTokensRepository.save(blacklistedToken);
            logger.info('Token blacklisted', { tokenPrefix: token.substring(0, 10), userId: decoded.userId });
        } catch (error) {
            logger.error('Error blacklisting token:', error);
            throw new Error('Failed to blacklist token');
        }
    }

    async isTokenBlacklisted(token: string): Promise<boolean> {
        const blacklistedToken = await this.blacklistedTokensRepository.findOne({ where: { token } });
        return !!blacklistedToken;
    }

    async refreshToken(refreshToken: string): Promise<string | null> {
        try {
            const decoded = jwt.verify(refreshToken, config.security.refreshTokenSecret) as TokenPayload;
            const newToken = this.generateToken(decoded.userId);
            return newToken;
        } catch (error) {
            logger.error('Error refreshing token:', error);
            return null;
        }
    }

    async cleanupExpiredTokens(): Promise<void> {
        const currentDate = new Date();
        const result = await this.blacklistedTokensRepository.delete({
            expires_at: LessThan(currentDate)
        });
        logger.info(`Cleaned up ${result.affected || 0} expired blacklisted tokens`);
    }
}
