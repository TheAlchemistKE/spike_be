import "reflect-metadata"
import {DataSource} from "typeorm";
import {User} from "./models/user";
import {BlacklistedTokens} from "./models/blacklisted_tokens";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "",
    database: "spike_userbase",
    entities: ["./models/*.ts"],
    synchronize: true,
    logging: false,
    poolSize: 10,
})
