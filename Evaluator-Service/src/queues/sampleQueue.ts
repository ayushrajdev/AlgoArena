import { Queue } from "bullmq";
import serverConfig from "../config/server.config.js";

const sampleQueue = new Queue("SampleQueue",{
    connection: {
        host: serverConfig.REDIS_HOST,
        port: serverConfig.REDIS_PORT,
        username: serverConfig.REDIS_USERNAME,
        password: serverConfig.REDIS_PASSWORD,
      },
});

export default sampleQueue;
