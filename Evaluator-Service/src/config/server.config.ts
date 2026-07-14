import dotenv from "dotenv";

dotenv.config();

const serverConfig = {
  PORT: Number(process.env.PORT) || 8080,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT:Number( process.env.REDIS_PORT),
  REDIS_USERNAME: process.env.REDIS_USERNAME,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
};

export enum Server_Queue {
  Submission = "SubmissionQueue",
  Sample = "SampleQueue"
}
export enum Queue_Jobs {
  Submission = "SubmissionJob",
  Sample = "SampleJob"
}

export default serverConfig;
