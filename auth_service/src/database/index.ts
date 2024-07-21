import "reflect-metadata"
import {DataSource} from "typeorm";
import {User} from "./models/user";
import {BlacklistedToken} from "./models/blacklisted_tokens";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "",
    database: "spike_userbase",
    entities: [User, BlacklistedToken],
    synchronize: true,
    logging: false,
    poolSize: 10,
})
