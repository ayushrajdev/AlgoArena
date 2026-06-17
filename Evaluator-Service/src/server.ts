import app from "./app.js";
import connectRedisServer from "./config/redis.config.js";
import serverConfig from "./config/server.config.js";

connectRedisServer().then(() => {
  app.listen(serverConfig.PORT, () => {
    console.log("server started");
  });
});
