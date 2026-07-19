import { Job } from "bullmq";

export default class EvaluationResponseJob {
    static async handle(job?:Job){
        return job?.data
    }
}