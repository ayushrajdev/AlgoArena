import app from "./app.js";
import serverConfig from "./config/server.config.js";
import runCppDockerContainer from "./containers/runCppDockerContainer.js";
// import sampleQueueProducer from "./producers/sampleQueueProducer.js";
// import sampleWorker from "./workers/sampleWorker.js";

app.listen(serverConfig.PORT, () => {
    // sampleWorker({ queueName: "SampleQueue" });
    // sampleQueueProducer({ name: "SampleJob", payload: { ok: "done" }, priority: 2 });
    // sampleQueueProducer({ name: "SampleJob", payload: { ok: "not done" } });

    const code = `
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
        for (int i = 1; i <= 10; i++) {
        std::cout << i << std::endl;
    }
    return 0;
}

  `;

    const inputCase = `10
`;

    runCppDockerContainer({
        code,
        inputTestCase: inputCase,
    });

});
