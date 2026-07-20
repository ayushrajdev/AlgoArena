import { createClient } from 'redis';

async function connectRedisDb(params) {
    const redisClient = await createClient()
        .on('error', (err) => console.log('Redis Client Error', err))
        .connect();

    return redisClient
}

export default connectRedisDb;
