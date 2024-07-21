import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface DatabaseConfig {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    poolSize: number;
    ssl: boolean;
}

interface CacheConfig {
    type: 'redis' | 'memcached';
    host: string;
    port: number;
    password: string | null;
    ttl: number;
}

interface QueueConfig {
    type: 'rabbitmq' | 'sqs';
    url: string;
    queueName: string;
}

interface LogConfig {
    level: 'debug' | 'info' | 'warn' | 'error';
    format: 'json' | 'plain';
    outputFile: string | null;
}

interface SecurityConfig {
    jwtSecret: string;
    bcryptRounds: number;
    rateLimitRequests: number;
    rateLimitWindowMs: number;
}

interface Config {
    env: 'development' | 'production' | 'test';
    port: number;
    apiVersion: string;
    database: DatabaseConfig;
    cache: CacheConfig;
    queue: QueueConfig;
    logging: LogConfig;
    security: SecurityConfig;
    corsAllowedOrigins: string[];
    maxRequestBodySize: string;
    workerProcesses: number | 'auto';
    sessionSecret: string;
}

function loadConfig(): Config {
    const env = (process.env.NODE_ENV as Config['env']) || 'development';

    const config: Config = {
        env,
        port: parseInt(process.env.PORT || '3000', 10),
        apiVersion: process.env.API_VERSION || 'v1',
        database: {
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432', 10),
            username: process.env.DB_USERNAME || 'postgres',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'myapp',
            poolSize: parseInt(process.env.DB_POOL_SIZE || '10', 10),
            ssl: process.env.DB_SSL === 'true',
        },
        cache: {
            type: (process.env.CACHE_TYPE as 'redis' | 'memcached') || 'redis',
            host: process.env.CACHE_HOST || 'localhost',
            port: parseInt(process.env.CACHE_PORT || '6379', 10),
            password: process.env.CACHE_PASSWORD || null,
            ttl: parseInt(process.env.CACHE_TTL || '3600', 10),
        },
        queue: {
            type: (process.env.QUEUE_TYPE as 'rabbitmq' | 'sqs') || 'rabbitmq',
            url: process.env.QUEUE_URL || 'amqp://localhost',
            queueName: process.env.QUEUE_NAME || 'tasks',
        },
        logging: {
            level: (process.env.LOG_LEVEL as LogConfig['level']) || 'info',
            format: (process.env.LOG_FORMAT as 'json' | 'plain') || 'json',
            outputFile: process.env.LOG_FILE || null,
        },
        security: {
            jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
            bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
            rateLimitRequests: parseInt(process.env.RATE_LIMIT_REQUESTS || '100', 10),
            rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
        },
        corsAllowedOrigins: process.env.CORS_ALLOWED_ORIGINS ? process.env.CORS_ALLOWED_ORIGINS.split(',') : ['http://localhost:3000'],
        maxRequestBodySize: process.env.MAX_REQUEST_BODY_SIZE || '1mb',
        workerProcesses: process.env.WORKER_PROCESSES === 'auto' ? 'auto' : parseInt(process.env.WORKER_PROCESSES || '1', 10),
        sessionSecret: process.env.SESSION_SECRET || 'session-secret',
    };

    // Load environment-specific overrides
    const envConfigPath = path.resolve(__dirname, `../config/${env}.json`);
    if (fs.existsSync(envConfigPath)) {
        const envConfig = JSON.parse(fs.readFileSync(envConfigPath, 'utf8'));
        Object.assign(config, envConfig);
    }

    return config;
}

const config = loadConfig();

export default config;
