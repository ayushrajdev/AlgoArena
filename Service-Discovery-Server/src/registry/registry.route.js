const express = require('express');
const registryController = require('./registry.controller');

const router = express.Router();

router.post('/register', registryController.register);
router.post('/:serviceName/:instanceId/heartbeat', registryController.heartbeat);
router.delete('/:serviceName/:instanceId', registryController.deregister);

router.get('/:serviceName', registryController.discoverOne);       // one instance (round-robin-ish)
router.get('/:serviceName/all', registryController.discoverAll);   // all instances
router.get('/', registryController.listAll);                       // full registry snapshot

module.exports = router;