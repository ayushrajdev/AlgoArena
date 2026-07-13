import app from "./app.js";
import serverConfig from "./config/server.config.js";
import submissionQueueProducer from "./producers/submissionQueueProducer.js";
import submissionWorker from "./workers/submissionWorker.js";

app.listen(serverConfig.PORT, () => {
    // sampleWorker({ queueName: "SampleQueue" });
    // sampleQueueProducer({ name: "SampleJob", payload: { ok: "done" }, priority: 2 });
    // sampleQueueProducer({ name: "SampleJob", payload: { ok: "not done" } });
    submissionQueueProducer({
        payload: {
            language: "cpp",
            userId: 21121,
            code: `
    #include <iostream>

    int main() {
        std::cout << "Hello, World!" << std::endl;
            for (int i = 1; i <= 10; i++) {
            std::cout << i << std::endl;
        }
        return 0;
    }

       `,
            inputCase: "100",
        },
    });
    submissionWorker();

    //     const code = `
    // #include <iostream>

    // int main() {
    //     std::cout << "Hello, World!" << std::endl;
    //         for (int i = 1; i <= 10; i++) {
    //         std::cout << i << std::endl;
    //     }
    //     return 0;
    // }

    //   `;

    //     const inputCase = `10
    // `;

    //     runCppDockerContainer({
    //         code,
    //         inputTestCase: inputCase,
    //     });
});
