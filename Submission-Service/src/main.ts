import dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { connectMongoDb } from './config/mongoDb.config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.setGlobalPrefix('/api/v1');

    await app.listen(Number(process.env.PORT) ?? 3000, () => {
        console.log(`Submission service started on port 3000`);
    });
}

connectMongoDb()
    .then((val) => {
        console.log('successfully connected to db');
        bootstrap();
    })
    .catch((err) => {
        process.exit(1);
    });
