import { Queue } from "bullmq";
import serverConfig, { Server_Queue } from "../config/server.config.js";

// Create a new connection in every instance
const EvaluationResponseQueue = new Queue(Server_Queue.EvaluationResponse, {
    connection: {
        host: serverConfig.REDIS_HOST,
        port: serverConfig.REDIS_PORT,
        username: serverConfig.REDIS_USERNAME,
        password: serverConfig.REDIS_PASSWORD,
    },
});

export default EvaluationResponseQueue;
