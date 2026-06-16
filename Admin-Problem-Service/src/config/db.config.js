import mongoose from 'mongoose';
import serverConfig from './server.config.js';

export async function connectDb() {
    if (serverConfig.NODE_ENV == 'development') {
        await mongoose.connect(serverConfig.DB_URL);
    } else {
        await mongoose.connect("prod db url");
    }
}
