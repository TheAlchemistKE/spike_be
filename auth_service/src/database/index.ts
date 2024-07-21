import "reflect-metadata"
import {DataSource} from "typeorm";
import {User} from "./models/user";
import {BlacklistedTokens} from "./models/blacklisted_tokens";
import {Profile} from "./models/profile";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "",
    database: "spike_userbase",
    entities: [User, Profile, BlacklistedTokens],
    synchronize: true,
    logging: false,
    poolSize: 10,
})
