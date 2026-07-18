const jwt = require('jsonwebtoken');
const userService = require('../user/user.service');
const { JWT_SECRET, JWT_EXPIRES_IN, NODE_ENV } = require('../../config/env');

function generateToken(user) {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
}

function setTokenCookie(res, token) {
    res.cookie('token', token, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
}

const authController = {
    async register(req, res, next) {
        try {
            const { name, username, email, password } = req.body;

            if (!name || !username || !email || !password) {
                return res.status(400).json({ success: false, message: 'All fields are required' });
            }
            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: 'Password must be at least 6 characters',
                });
            }

            const user = await userService.createUser({ name, username, email, password });
            const token = generateToken(user);
            setTokenCookie(res, token);

            res.status(201).json({ success: true, data: user, token });
        } catch (error) {
            next(error);
        }
    },

    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ success: false, message: 'Email and password are required' });
            }

            const user = await userService.validateCredentials(email, password);
            const token = generateToken(user);
            setTokenCookie(res, token);

            res.status(200).json({ success: true, data: user, token });
        } catch (error) {
            next(error);
        }
    },

    async logout(req, res, next) {
        try {
            res.clearCookie('token', {
                httpOnly: true,
                secure: NODE_ENV === 'production',
                sameSite: 'lax',
            });
            res.status(200).json({ success: true, message: 'Logged out successfully' });
        } catch (error) {
            next(error);
        }
    },
};

module.exports = authController;