import { Job } from "bullmq";
import type { IJob } from "../types/bullMqJob.js";
import type { ISubmissionPayload } from "../types/submissionPayload.js";
import CodeExecutorFactory from "../factories/CodeExecutorFactory.js";
import EvaluationResponseQueueProducer from "../producers/evaluationResponseQueueProducer.js";

export default class SubmissionJob implements IJob {
    name: string;
    payload: Record<string, ISubmissionPayload>;

    constructor(payload: Record<string, ISubmissionPayload>) {
        this.payload = payload;
        this.name = this.constructor.name;
    }

    async handle(job?: Job): Promise<void> {
        if (!job) return;

        const {
            code,
            language,
            inputTestCase,
            outputTestCase,
            userId,
            submissionId,
            problemId,
            timeLimit,
            memoryLimit,
        } = job.data as ISubmissionPayload;

        console.log("inside the job handler", {
            code,
            language,
            inputTestCase,
            outputTestCase,
            userId,
            submissionId,
            problemId,
            timeLimit,
            memoryLimit,
        });

        console.log("Submission Job Started");

        if (inputTestCase.length !== outputTestCase.length) {
            throw new Error("Input and Output test case count mismatch.");
        }
        console.log("calling executor ");

        const executor = CodeExecutorFactory.get(language);

        if (!executor) {
            throw new Error(`Executor not found for ${language}`);
        }

        for (let i = 0; i < inputTestCase.length; i++) {
            console.log(`Running Test Case ${i + 1}`);
            let result;
            try {
                result = await executor.execute({
                    code,
                    inputTestCase: inputTestCase[i] as string,
                    memoryLimit: Number(memoryLimit) ?? 256,
                    timeLimit: Number(timeLimit) ?? 1000,
                });
            } catch (err: any) {
                if (err instanceof Error && err.message === "Time Limit Exceeded") {
                    console.log("Time Limit Exceeded");

                    EvaluationResponseQueueProducer({
                        payload: {
                            submissionId,
                            userId,
                            problemId,
                            verdict: "TIME_LIMIT_EXCEEDED",
                            error: true,
                            data: err.message,
                        },
                    });
                    return
                }
                EvaluationResponseQueueProducer({
                    payload: {
                        submissionId,
                        userId,
                        problemId,
                        verdict: "Error",
                        error: true,
                        data: err.message ?? "",
                    },
                });

                // throw err;
                return;
            }

            const actual = result?.stdout.trim();
            const expected = outputTestCase[i]?.trim();

            console.log("Actual:", JSON.stringify(actual));
            console.log("Expected:", JSON.stringify(expected));

            if (result.stderr.trim().length > 0) {
                console.log("Runtime Error");
                console.log(result.stderr);
                EvaluationResponseQueueProducer({ payload: {
                        submissionId,
                        userId,
                        problemId,
                        verdict: "Error",
                        error: true,
                        data: result.stderr
                    }, });
                return;
            }

            if (actual !== expected) {
                console.log("Wrong Answer");
                console.log("Input    :", inputTestCase[i]);
                console.log("Expected :", expected);
                console.log("Actual   :", actual);
                EvaluationResponseQueueProducer({
                    payload: { submissionId, userId, problemId, error: true },
                });

                return;
            }

            console.log(`✅ Test Case ${i + 1} Passed`);
        }
        EvaluationResponseQueueProducer({
            payload: { submissionId, userId, problemId, error: false, data: {} },
        });

        console.log("🎉 Accepted");
    }

    failed(job?: Job): void {
        console.log("Submission Failed:", job?.id);
    }
}
