const userService = require('./user.service');

const userController = {
    async getMe(req, res, next) {
        try {
            const user = await userService.getUserById(req.user.id);
            res.status(200).json({ success: true, data: user });
        } catch (error) {
            next(error);
        }
    },

    async getAllUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            res.status(200).json({ success: true, data: users });
        } catch (error) {
            next(error);
        }
    },

    async getUserById(req, res, next) {
        try {
            const user = await userService.getUserById(req.params.id);
            res.status(200).json({ success: true, data: user });
        } catch (error) {
            next(error);
        }
    },

    async updateMe(req, res, next) {
        try {
            const user = await userService.updateUser(req.user.id, req.body);
            res.status(200).json({ success: true, data: user });
        } catch (error) {
            next(error);
        }
    },

    async updateUser(req, res, next) {
        try {
            const user = await userService.updateUser(req.params.id, req.body);
            res.status(200).json({ success: true, data: user });
        } catch (error) {
            next(error);
        }
    },

    async changePassword(req, res, next) {
        try {
            const { currentPassword, newPassword } = req.body;
            if (!currentPassword || !newPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Current and new password are required',
                });
            }
            await userService.changePassword(req.user.id, currentPassword, newPassword);
            res.status(200).json({ success: true, message: 'Password updated successfully' });
        } catch (error) {
            next(error);
        }
    },

    async deleteUser(req, res, next) {
        try {
            await userService.deleteUser(req.params.id);
            res.status(200).json({ success: true, message: 'User deleted successfully' });
        } catch (error) {
            next(error);
        }
    },
};

module.exports = userController;