import { Repository } from "typeorm";
import {User} from "../models/user";
import {AppDataSource} from "../index";

export class UserRepository {
    private repo: Repository<User>;

    constructor() {
        this.repo = AppDataSource.getRepository(User);
    }

    async create(user: Partial<User>): Promise<User> {
        const newUser = this.repo.create(user);
        return await this.repo.save(newUser);
    }

    async findById(id: string): Promise<User | null> {
        return await this.repo.findOne({ where: { id } });
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.repo.findOne({ where: { email } });
    }

    async update(id: string, userData: Partial<User>): Promise<User | null> {
        await this.repo.update(id, userData);
        return this.findById(id);
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.repo.delete(id);
        return result.affected !== 0;
    }

    async findAll(): Promise<User[]> {
        return await this.repo.find();
    }

    async findByRefreshToken(refreshToken: string): Promise<User | null> {
        return await this.repo.findOne({ where: { refresh_token: refreshToken } });
    }
}
