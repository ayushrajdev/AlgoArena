import { Queue_Jobs } from "../config/server.config.js";
import EvaluationResponseQueue from "../queues/evaluationResponseQueue.js";

async function EvaluationResponseQueueProducer({
    name = Queue_Jobs.EvaluationResponse,
    payload,
    priority,
}: {
    name?: string;
    payload: Record<string, unknown>;
    priority?: number | undefined;
}): Promise<any> {
    await EvaluationResponseQueue.add(name, payload, { priority: priority || 1 });
    console.log("successfully added the new job");
}

export default EvaluationResponseQueueProducer;