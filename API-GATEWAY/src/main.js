const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const { PORT } = require('./config/env');

const authRoutes = require('./modules/auth/auth.route');
const userRoutes = require('./modules/user/user.route');

const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // your Vite dev server, exact match, no wildcard
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);

app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// centralized error handler — every controller's catch(next(error)) lands here
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal server error',
    });
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`API Gateway running on port ${PORT}`);
    });
});