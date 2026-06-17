import sampleQueue from "../queues/sampleQueue.js";

async function sampleQueueProducer({
  name,
  payload,
  priority,
}: {
  name: string;
  payload: Record<string, unknown>;
  priority?: number | undefined;
}): Promise<any> {
  await sampleQueue.add(name, payload, { priority: priority || 1 });

  console.log("successfully added the new job");
}

export default sampleQueueProducer;
