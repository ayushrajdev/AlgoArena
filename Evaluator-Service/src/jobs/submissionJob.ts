import { type Job } from "bullmq";
import type { IJob } from "../types/bullMqJob";
import type { ISubmissionPayload } from "../types/submissionPayload";
import runCppDockerContainer from "../containers/runCppDockerContainer.js";
import runJavaDockerContainer from "../containers/runJavaDockerContainer.js";
import runPythonContainer from "../containers/runPythonDockerContainer.js";

class SubmissionJob implements IJob {
    name: string;
    payload: Record<string, ISubmissionPayload>;
    constructor(payload: Record<string, ISubmissionPayload>) {
        this.payload = payload;
        this.name = this.constructor.name;
    }
    handle(job?: Job): void {
        console.log("handler of the job called");
        console.log(job?.data);
        const { code, language, inputCase }: ISubmissionPayload = job?.data;
        switch (language) {
            case "cpp":
                runCppDockerContainer({ code, inputTestCase: inputCase });
                break;

            case "java":
                runJavaDockerContainer({ code, inputTestCase: inputCase });
                break;

            case "python":
                runPythonContainer({ code, inputTestCase: inputCase });
                break;

            default:
                break;
        }
    }
    failed(job?: Job): void {
        console.log("job failed", job?.id);
    }
}

export default SubmissionJob;
