import app from "./app.js";
import serverConfig from "./config/server.config.js";
import runPythonContainer from "./containers/runPythonDocker.js";
// import sampleQueueProducer from "./producers/sampleQueueProducer.js";
// import sampleWorker from "./workers/sampleWorker.js";

app.listen(serverConfig.PORT, () => {
    // sampleWorker({ queueName: "SampleQueue" });
    // sampleQueueProducer({ name: "SampleJob", payload: { ok: "done" }, priority: 2 });
    // sampleQueueProducer({ name: "SampleJob", payload: { ok: "not done" } });

    const code = `x = input()
y = input()
print("value of x is", x)
print("value of y is", y)
`;

const inputCase = `100
200
`;
    runPythonContainer({
        code,
        inputTestCase: inputCase,
    });
});
