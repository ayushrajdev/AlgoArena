import { Redis } from "ioredis";
import serverConfig from "./server.config.js";

export const redisConnectionConfig = {
    host: serverConfig.REDIS_HOST,
    port: Number(serverConfig.REDIS_PORT),
    username: serverConfig.REDIS_USERNAME,
    password: serverConfig.REDIS_PASSWORD,
};
console.log(redisConnectionConfig);

const redisConnection = new Redis({
    ...redisConnectionConfig,
    maxRetriesPerRequest: null,
    keepAlive: 10000,
});

redisConnection.on("connect", () => console.log("Successfully connected to Redis!"));
process.on("SIGINT", async () => {
    console.log(`succesfully closing the redis connection`);
    
    await redisConnection.quit(); // Tells Redis to close gracefully
    process.exit(0);
});

process.on("SIGTERM", async () => {
    console.log(`succesfully closing the redis connection`);
    await redisConnection.quit();
    process.exit(0);
});

export default redisConnection;
