import { Job, Worker } from "bullmq";
import SubmissionJob from "../jobs/submissionJob.js";
import serverConfig, { Queue_Jobs, Server_Queue } from "../config/server.config.js";

async function submissionWorker({
    queueName = Server_Queue.Submission,
}: { queueName?: string } = {}) {
    
    new Worker(
        queueName,
        async function (job: Job) {
            
            if (job.name == Queue_Jobs.Submission) {
                console.log("inside the Submission job worker");
                
                var submissionJobInstance = new SubmissionJob(job.data);
                await submissionJobInstance.handle(job);
            }
        },
        {
            connection: {
                host: serverConfig.REDIS_HOST,
                port: serverConfig.REDIS_PORT,
                username: serverConfig.REDIS_USERNAME,
                password: serverConfig.REDIS_PASSWORD,
            },
        }
    );
}

export default submissionWorker;
