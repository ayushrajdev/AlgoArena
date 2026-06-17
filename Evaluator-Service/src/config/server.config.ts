import dotenv from 'dotenv';

dotenv.config();

const serverConfig = {
    PORT: process.env.PORT || 8080,
};


export default serverConfig