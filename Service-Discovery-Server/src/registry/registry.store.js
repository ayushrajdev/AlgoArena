const { randomUUID } = require('crypto');

// serviceName -> Map<instanceId, instance>
const registry = new Map();

const registryStore = {
    register({ serviceName, host, port, metadata = {} }) {
        const instanceId = randomUUID();
        const instance = {
            instanceId,
            serviceName,
            host,
            port,
            metadata,
            registeredAt: Date.now(),
            lastHeartbeat: Date.now(),
        };

        if (!registry.has(serviceName)) {
            registry.set(serviceName, new Map());
        }
        registry.get(serviceName).set(instanceId, instance);

        return instance;
    },

    heartbeat(serviceName, instanceId) {
        const instances = registry.get(serviceName);
        const instance = instances?.get(instanceId);
        if (!instance) return null;

        instance.lastHeartbeat = Date.now();
        return instance;
    },

    deregister(serviceName, instanceId) {
        const instances = registry.get(serviceName);
        if (!instances) return false;

        const existed = instances.delete(instanceId);
        if (instances.size === 0) registry.delete(serviceName);

        return existed;
    },

    getInstances(serviceName) {
        const instances = registry.get(serviceName);
        return instances ? Array.from(instances.values()) : [];
    },

    getAllServices() {
        const result = {};
        for (const [serviceName, instances] of registry.entries()) {
            result[serviceName] = Array.from(instances.values());
        }
        return result;
    },

    // removes instances that haven't sent a heartbeat within the TTL window
    pruneStaleInstances(ttlMs) {
        const now = Date.now();
        const removed = [];

        for (const [serviceName, instances] of registry.entries()) {
            for (const [instanceId, instance] of instances.entries()) {
                if (now - instance.lastHeartbeat > ttlMs) {
                    instances.delete(instanceId);
                    removed.push({ serviceName, instanceId });
                }
            }
            if (instances.size === 0) registry.delete(serviceName);
        }

        return removed;
    },
};

module.exports = registryStore;