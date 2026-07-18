const registryStore = require('./registry.store');
const { HEARTBEAT_TTL_MS, SWEEP_INTERVAL_MS } = require('../config/env');

function startSweeper() {
    setInterval(() => {
        const removed = registryStore.pruneStaleInstances(HEARTBEAT_TTL_MS);
        removed.forEach(({ serviceName, instanceId }) => {
            console.log(`[registry] pruned stale instance ${instanceId} of "${serviceName}"`);
        });
    }, SWEEP_INTERVAL_MS);
}

module.exports = startSweeper;