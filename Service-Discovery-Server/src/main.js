const express = require('express');
const { PORT } = require('./config/env');
const registryRoutes = require('./registry/registry.route');
const startSweeper = require('./registry/registry.sweeper');

const app = express();
app.use(express.json());

app.use('/api/v1/registry', registryRoutes);

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal server error',
    });
});

startSweeper();

app.listen(PORT, () => {
    console.log(`Service discovery server running on port ${PORT}`);
});