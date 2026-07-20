import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import connectRedisDb from './config/redis.config.js'; // Note the explicit .js extension

const app = express();
const server = http.createServer(app);

const redisClient = await connectRedisDb();

app.use(express.json());

// Configure CORS inside the Socket.IO constructor
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173', // Allow your Vite frontend origin
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('send-userId', async (data) => {
        console.log(data);

        redisClient.set(data, socket.id);
    });
});
app.post('/api/v1/evaluation-response', async function (req, res) {
    console.log(req.body);
    const { userId, submissionId, payload, error } = req.body;

    if (!userId || !submissionId) {
        return res.end();
    }
    const socketId = await redisClient.get(userId);
    console.log(socketId);

    if (socketId) {
        await io.to(socketId).emit('evaluation-response', { payload, error,userId,submissionId });
        res.end("done")
    }
});

server.listen(9000, () => {
    console.log('Server is running on port 9000');
});
