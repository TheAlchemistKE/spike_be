import {Repository} from "typeorm";
import {User} from "../models/user";
import {AppDataSource} from "../index";
import {IUser} from "../../interfaces/user";

class UserRepository {
    private static instance: UserRepository;
    private repo: Repository<User>;

    constructor() {
        this.repo = AppDataSource.getRepository(User);
    }

    public static getInstance(): UserRepository {
        if (!UserRepository.instance) {
            UserRepository.instance = new UserRepository()
        }
        return UserRepository.instance
    }

    async create(user: IUser){
        try {
            return await this.repo.create(user);
        } catch (e: any) {
            console.error(e.message);
        }
    }

    async find(email: string) {
        try {
            const user = await this.repo.findBy({
                email,
            })
            if(!user) {
                throw new Error("User not found");
            }

            return user;
        } catch (e: any) {
            console.error(e.message);
        }
    }

    async update(email: string, user: Partial<IUser>){
        try {
            return await this.repo.update({ email}, user)
        } catch (e: any) {
            console.error(e.message);
        }
    }

    async delete(email: string) {
        try {
           return await this.repo.delete({ email });
        } catch (e: any) {
            console.error(e.message);
        }
    }
}

const userRepo = UserRepository.getInstance()
export default userRepo;
