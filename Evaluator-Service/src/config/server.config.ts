import dotenv from 'dotenv';

dotenv.config();

const serverConfig = {
    PORT: process.env.PORT || 8000,
};


export default serverConfig