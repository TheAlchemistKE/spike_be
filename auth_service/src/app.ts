import express from 'express';
import { Server} from 'socket.io'
import dotenv from 'dotenv';
import helmet from "helmet";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser"
import { io as auth_emitter } from "socket.io-client";
import "reflect-metadata"
import http from "http";
import cron from 'node-cron'
import {AppDataSource} from "./database";
import {logger} from "./config/logger";
import router from "./routes";
import {tokenService} from "./config/di";
dotenv.config();



export default async (port: number) => {
    const app = express();
    const server = http.createServer(app);
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
            allowedHeaders: ["Authorization", "Content-Type", "App", "Accept"],
            // credentials: true
        },
    });

    const auth_socket = auth_emitter('', {
        transports: ["websocket"],
        //@ts-ignore
        pingInterval: 60000,
        pingTimeout: 60000,
        upgradeTimeout: 30000,
    })


    // Apply Middlewares
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser())
    app.use(helmet());

    app.use('/api/v1', router)


    cron.schedule('0 0 * * *', async () => {
        try {
            await tokenService.cleanupExpiredTokens()
            logger.info('Blacklist cleanup job completed successfully.');
        } catch (e: any) {
            logger.error('Error in blacklist cleanup job: ', e)
        }
    })




    return app.listen(port, async () => {
        await AppDataSource.initialize()
        console.log(`Server running on port ${port}`);
    })

}
