import dotenv from 'dotenv';

function loadEnv(params) {
    dotenv.config();
}

loadEnv();

const serverConfig = {
    PORT: Number(process.env.PORT) || 3000,
    DB_URL: process.env.DB_URL,
    NODE_ENV: process.env.NODE_ENV || "development",
    MY_SERVICE_NAME:process.env.MY_SERVICE_NAME,
    HOST:process.env.HOST
};

export default serverConfig;
