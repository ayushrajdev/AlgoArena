import app from "./app.js";
import serverConfig from "./config/server.config.js";
import sampleQueueProducer from "./producers/sampleQueue.producer.js";
import sampleWorker from "./workers/sampleWorker.js";

app.listen(serverConfig.PORT, () => {
  sampleWorker({queueName:"SampleQueue"})
  sampleQueueProducer({ name: "SampleJob", payload: { ok: "done" } });
  console.log("server started");
});
