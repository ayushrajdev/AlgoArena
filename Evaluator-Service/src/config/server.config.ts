import dotenv from "dotenv";

dotenv.config();

const serverConfig = {
  PORT: process.env.PORT || 8080,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT:Number( process.env.REDIS_PORT),
  REDIS_USERNAME: process.env.REDIS_USERNAME,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
};

export default serverConfig;
