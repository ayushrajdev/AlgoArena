const registryService = require('./registry.service');

const registryController = {
    register(req, res, next) {
        try {
            const instance = registryService.registerService(req.body);
            res.status(201).json({ success: true, data: instance });
        } catch (error) {
            next(error);
        }
    },

    heartbeat(req, res, next) {
        try {
            const { serviceName, instanceId } = req.params;
            const instance = registryService.sendHeartbeat(serviceName, instanceId);
            res.status(200).json({ success: true, data: instance });
        } catch (error) {
            next(error);
        }
    },

    deregister(req, res, next) {
        try {
            const { serviceName, instanceId } = req.params;
            registryService.deregisterService(serviceName, instanceId);
            res.status(200).json({ success: true, message: 'Deregistered successfully' });
        } catch (error) {
            next(error);
        }
    },

    discoverOne(req, res, next) {
        try {
            const instance = registryService.discoverOne(req.params.serviceName);
            res.status(200).json({ success: true, data: instance });
        } catch (error) {
            next(error);
        }
    },

    discoverAll(req, res, next) {
        try {
            const instances = registryService.discoverAll(req.params.serviceName);
            res.status(200).json({ success: true, data: instances });
        } catch (error) {
            next(error);
        }
    },

    listAll(req, res, next) {
        try {
            const services = registryService.listAllServices();
            res.status(200).json({ success: true, data: services });
        } catch (error) {
            next(error);
        }
    },
};

module.exports = registryController;