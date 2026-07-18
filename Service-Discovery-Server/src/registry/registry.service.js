const registryStore = require('./registry.store');

const registryService = {
    registerService({ serviceName, host, port, metadata }) {
        if (!serviceName || !host || !port) {
            const error = new Error('serviceName, host, and port are required');
            error.statusCode = 400;
            throw error;
        }
        return registryStore.register({ serviceName, host, port, metadata });
    },

    sendHeartbeat(serviceName, instanceId) {
        const instance = registryStore.heartbeat(serviceName, instanceId);
        if (!instance) {
            const error = new Error('Service instance not found — it may have expired, register again');
            error.statusCode = 404;
            throw error;
        }
        return instance;
    },

    deregisterService(serviceName, instanceId) {
        const existed = registryStore.deregister(serviceName, instanceId);
        if (!existed) {
            const error = new Error('Service instance not found');
            error.statusCode = 404;
            throw error;
        }
        return true;
    },

    // returns one healthy instance, round-robin style, for simple client-side load balancing
    discoverOne(serviceName) {
        const instances = registryStore.getInstances(serviceName);
        if (instances.length === 0) {
            const error = new Error(`No instances registered for service "${serviceName}"`);
            error.statusCode = 404;
            throw error;
        }
        const index = Math.floor(Math.random() * instances.length);
        return instances[index];
    },

    discoverAll(serviceName) {
        const instances = registryStore.getInstances(serviceName);
        if (instances.length === 0) {
            const error = new Error(`No instances registered for service "${serviceName}"`);
            error.statusCode = 404;
            throw error;
        }
        return instances;
    },

    listAllServices() {
        return registryStore.getAllServices();
    },
};

module.exports = registryService;