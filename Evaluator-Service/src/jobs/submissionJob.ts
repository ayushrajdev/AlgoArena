import { type Job } from "bullmq";
import type { IJob } from "../types/bullMqJob";
import type { ISubmissionPayload } from "../types/submissionPayload.js";
import CodeExecutorFactory from "../factories/CodeExecutorFactory.js";

class SubmissionJob implements IJob {
    name: string;
    payload: Record<string, ISubmissionPayload>;
    constructor(payload: Record<string, ISubmissionPayload>) {
        this.payload = payload;
        this.name = this.constructor.name;
    }

    async handle(job?: Job): Promise<void> {
        console.log("handler of the job called");
        const { code, language, inputCase }: ISubmissionPayload = job?.data;
        const codeExecutor = CodeExecutorFactory.get(language);
        await codeExecutor.execute({ code, inputTestCase: inputCase });
    }
    failed(job?: Job): void {
        console.log("job failed", job?.id);
    }
}

export default SubmissionJob;
