import { Redis } from 'ioredis';
import serverConfig from './server.config.js';

export const redisConnectionConfig = {
    host: serverConfig.REDIS_HOST,
    port: Number(serverConfig.REDIS_PORT),
    username: serverConfig.REDIS_USERNAME,
    password: serverConfig.REDIS_PASSWORD,
};
const redisConnection = new Redis({
    ...redisConnectionConfig,
    maxRetriesPerRequest: null,
    keepAlive: 10000,
});

redisConnection.on('connect', () =>
    console.log('Successfully connected to Redis!'),
);

export default redisConnection;
