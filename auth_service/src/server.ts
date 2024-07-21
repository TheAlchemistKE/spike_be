import * as os from "node:os";
import * as cluster from "node:cluster";
import dotenv from "dotenv";
import app from "./app";

dotenv.config();

const { PORT, NODE_ENV } = process.env;

export default (async () => {
    process.on('uncaughtException', (error) => {
        console.error({ uncaughtException: error });
    });

    process.on('unhandledRejection', function (error) {
        console.error({ unhandledRejection: error });
    });

    const cpus = os.cpus().length;

    //@ts-ignore
    if (cluster.isMaster && NODE_ENV === 'production') {
        for (let i = 0; i < cpus; i++) {
            //@ts-ignore
            cluster.fork();
        }
        //@ts-ignore
        cluster.on('exit', (worker) => {
            console.warn(`[${worker.process.pid}]`, {
                message: 'Process terminated. Restarting.',
            });
            //@ts-ignore
            cluster.fork();
        });
    } else {
        await app(Number(PORT));
    }


})();
