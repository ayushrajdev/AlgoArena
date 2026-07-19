import app from "./app.js";
import serverConfig from "./config/server.config.js";
import submissionWorker from "./workers/submissionWorker.js";

app.listen(serverConfig.PORT, async () => {
    submissionWorker();
});
