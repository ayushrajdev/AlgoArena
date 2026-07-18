const express = require('express');
const userController = require('./user.controller');
const isAuthenticated = require('../../middlewares/auth.middleware');
const isAdmin = require('../../middlewares/isAdmin.middleware');

const router = express.Router();

router.get('/me', isAuthenticated, userController.getMe);
router.put('/me', isAuthenticated, userController.updateMe);
router.put('/me/password', isAuthenticated, userController.changePassword);

router.get('/', isAuthenticated, isAdmin, userController.getAllUsers);
router.get('/:id', isAuthenticated, userController.getUserById);
router.put('/:id', isAuthenticated, isAdmin, userController.updateUser);
router.delete('/:id', isAuthenticated, isAdmin, userController.deleteUser);

module.exports = router;