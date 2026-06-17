import sampleQueue from "../queues/sampleQueue.js";

async function sampleQueueProducer({
  name,
  payload,
}: {
  name: string;
  payload: Record<string, unknown>;
}): Promise<void> {
  await sampleQueue.add(name, payload);
  console.log("successfully added the new job");
}

export default sampleQueueProducer;
