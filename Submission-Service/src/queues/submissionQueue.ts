import { Queue } from "bullmq";
import serverConfig, { Server_Queue } from "../config/server.config.js";

const submissionQueue = new Queue(Server_Queue.Submission,{
    connection: {
        host: serverConfig.REDIS_HOST,
        port: serverConfig.REDIS_PORT,
        username: serverConfig.REDIS_USERNAME,
        password: serverConfig.REDIS_PASSWORD,
      },
});

export default submissionQueue;
