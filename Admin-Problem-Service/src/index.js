import serverConfig from './config/server.config.js';
import express from 'express';
import v1Router from './routers/v1/index.js';
import genericErrorHandler from './utils/genericErrorHandler.js';
import { connectDb } from './config/db.config.js';
import logger from './config/logger.config.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());

app.use('/api/v1', v1Router);

app.use(genericErrorHandler);

connectDb()
    .then(() => {
        console.log('connected to database');
        app.listen(serverConfig.PORT, () => {
            logger.info(`server is listening on port ${serverConfig.PORT}`);
            console.log(serverConfig);
        });
        logger.error('server started');
    })
    .catch((err) => {
        console.log('could not connect to database');
        console.log(err);
    });
