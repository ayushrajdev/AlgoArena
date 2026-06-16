import dotenv from 'dotenv';

function loadEnv(params) {
    dotenv.config();
}

loadEnv();

const serverConfig = {
    PORT: process.env.PORT || 3000,
    DB_URL: process.env.DB_URL,
    NODE_ENV: process.env.NODE_ENV || "development",
};

export default serverConfig;
