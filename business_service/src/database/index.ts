import "reflect-metadata"
import {DataSource} from "typeorm";
import {Store} from "./models/store";
import {Category} from "./models/category";
import {Product} from "./models/product";
import {Review} from "./models/review";


export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "",
    database: "spike_business_db",
    entities: [Store, Category, Product, Review],
    synchronize: true,
    logging: false,
    poolSize: 10,
})
