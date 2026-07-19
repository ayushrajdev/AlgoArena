import dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { connectMongoDb } from './config/mongoDb.config';
import axios from 'axios';
import serverConfig from './config/server.config';
import EvaluationResponseWorker from './workers/evaluationResponseQueueWorker';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.setGlobalPrefix('/api/v1');

    await app.listen(Number(process.env.PORT) ?? 3000, () => {
        console.log(Number(process.env.PORT));
        
        console.log(`Submission service started on port 3000`);
    });
}

connectMongoDb()
    .then(async (val) => {
        console.log('successfully connected to db');

        EvaluationResponseWorker()
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
        bootstrap();
    })
    .catch((err) => {
        process.exit(1);
    });
