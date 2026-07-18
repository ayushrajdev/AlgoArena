require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 10000,
    HEARTBEAT_TTL_MS: Number(process.env.HEARTBEAT_TTL_MS) || 15000, // service considered dead after this long without a heartbeat
    SWEEP_INTERVAL_MS: Number(process.env.SWEEP_INTERVAL_MS) || 5000, // how often to check for dead services
};