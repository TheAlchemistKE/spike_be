import { Repository, LessThan } from "typeorm";
import {AppDataSource} from "../index";
import {BlacklistedToken} from "../models/blacklisted_tokens";

export class BlacklistedTokenRepository {
    private repo: Repository<BlacklistedToken>;

    constructor() {
        this.repo = AppDataSource.getRepository(BlacklistedToken);
    }

    async create(token: string, expiresAt: Date): Promise<BlacklistedToken> {
        const blacklistedToken = this.repo.create({ token, expires_at: expiresAt });
        return await this.repo.save(blacklistedToken);
    }

    async findByToken(token: string): Promise<BlacklistedToken | null> {
        return await this.repo.findOne({ where: { token } });
    }

    async removeExpired(): Promise<void> {
        await this.repo.delete({ expires_at: LessThan(new Date()) });
    }
}
