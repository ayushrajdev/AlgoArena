import serverConfig from './config/server.config.js';
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import v1Router from './routers/v1/index.js';
import genericErrorHandler from './utils/genericErrorHandler.js';
import { connectDb } from './config/db.config.js';
import logger from './config/logger.config.js';


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());
app.use(cors());

app.use('/api/v1', v1Router);

app.use(genericErrorHandler);

connectDb()
    .then(async () => {
        console.log('connected to database');
        app.listen(serverConfig.PORT, () => {
            logger.info(`server is listening on port ${serverConfig.PORT}`);
            console.log(serverConfig);
        });
        logger.error('server started');

        // on startup
        const res = await axios.post(
            'http://localhost:10000/api/v1/registry/register',
            {
                serviceName: serverConfig.MY_SERVICE_NAME,
                host: serverConfig.HOST,
                port: Number(serverConfig.PORT),
            },
        );
        console.log(res.data.data);
        
        const { instanceId } = res.data.data;

        // every ~10s (before the 15s TTL expires)
        setInterval(() => {
            axios.post(
                `http://localhost:10000/api/v1/registry/${serverConfig.MY_SERVICE_NAME}/${instanceId}/heartbeat`,
            );
        }, 10000);

        // // on shutdown
        // process.on('SIGINT', async () => {
        //     await axios.delete(
        //         `http://localhost:10000/api/v1/registry/api-gateway/${instanceId}`,
        //     );
        //     process.exit(0);
        // });

        // // anywhere else that wants to find the gateway
        // const target = await axios.get(
        //     'http://localhost:10000/api/v1/registry/problem-admin',
        // );
        // target.data.data => { host, port, ... }
    })
    .catch((err) => {
        console.log('could not connect to database');
        console.log(err);
    });
