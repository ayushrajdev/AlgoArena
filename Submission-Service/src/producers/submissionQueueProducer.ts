import serverConfig, { Queue_Jobs } from "../config/server.config.js";
import submissionQueue from "../queues/submissionQueue.js";

async function submissionQueueProducer({
    name = Queue_Jobs.Submission,
    payload,
    priority,
}: {
    name?: string;
    payload: Record<string, unknown>;
    priority?: number | undefined;
}): Promise<any> {    
    await submissionQueue.add(name, payload, { priority: priority || 1 });
    console.log("successfully added the new job");
}

export default submissionQueueProducer;
