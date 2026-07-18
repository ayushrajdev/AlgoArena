require('dotenv').config();

module.exports = {
    PORT: Number(process.env.PORT) || 5000,
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/api-gateway',
    JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    NODE_ENV: process.env.NODE_ENV || 'development',
};