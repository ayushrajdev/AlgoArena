import { Job, Worker } from "bullmq";
import SampleJob from "../jobs/sampleJob.js";
import serverConfig from "../config/server.config.js";

async function sampleWorker({ queueName }: { queueName: string }) {
  new Worker(
    queueName,
    async function (job: Job) {
      console.log("inside the job worker");

      if (job.name == "SampleJob") {
        var sampleJobInstance = new SampleJob(job.data);
        sampleJobInstance.handle(job);
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

export default sampleWorker;
