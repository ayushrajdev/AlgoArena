import { type Job } from "bullmq";
import type { IJob } from "../types/bullMqJob";

class SampleJob implements IJob {
  name: string;
  payload: Record<string, unknown>;
  constructor(payload: Record<string, unknown>) {
    this.payload = payload;
    this.name = this.constructor.name;
  }
  handle(job?: Job): void {
    console.log("handler of the job called");
  }
  failed(job?: Job): void {
    console.log("job failed", job?.id);
  }
}

export default SampleJob;
