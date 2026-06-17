import { createClient } from "redis";

const redisClient = createClient({
  username: "default",
  password: "2zX4B88iQaF9Pe8o0jkCP7qJ7uJ3Lvk9",
  socket: {
    host: "bait-ducks-lightsome-80007.db.redis.io",
    port: 14071,
  },
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

async function connectRedisServer() {
  return redisClient.connect();
}

export default connectRedisServer;

// await redisClient.set("foo", "bar");
// const result = await redisClient.get("foo");
// console.log(result); // >>> bar
