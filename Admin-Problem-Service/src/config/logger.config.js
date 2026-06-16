import { MongoClient } from 'mongodb';
import winston, { format, transports } from 'winston';
import 'winston-mongodb';
import { Writable } from 'node:stream';
import { addToCosmos } from './cosmos.config';

let transports = [
    new transports.Console(),
    new transports.File({ filename: 'app.log' }),
];

const stream = new Writable({
    write(chunk, encoding, callback) {
        let message = chunk.toString();
        addToCosmos('error', message);
        callback();
    },
});

const streamTransprort = new winston.transports.Stream({ stream });
transports.push(streamTransprort);

transports.push();
const logger = winston.createLogger({
    level: 'info',
    transports,

    format: format.combine(
        format.colorize(),
        format.timestamp({
            format: 'DD-MM-YYYY HH-MM-SS',
        }),
        format.printf(
            ({ timestamp, level, message, data }) =>
                `${timestamp} [${level}] : ${message}`,
        ),
    ),
});

const url = 'mongodb://localhost:27017/logs';

const client = new MongoClient(url);
await client.connect();

logger.add(
    new transports.MongoDB({
        db: await Promise.resolve(client),
        collection: 'log',
        level: 'error',
    }),
);

export default logger;
