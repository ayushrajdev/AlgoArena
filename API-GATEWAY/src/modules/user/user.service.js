const bcrypt = require('bcrypt');
const userRepository = require('./user.repository');

const SALT_ROUNDS = 10;

const userService = {
    async createUser({ name, username, email, password }) {
        const existingEmail = await userRepository.findByEmail(email);
        if (existingEmail) {
            const error = new Error('Email is already registered');
            error.statusCode = 409;
            throw error;
        }

        const existingUsername = await userRepository.findByUsername(username);
        if (existingUsername) {
            const error = new Error('Username is already taken');
            error.statusCode = 409;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await userRepository.create({
            name,
            username,
            email,
            password: hashedPassword,
        });

        return sanitizeUser(user);
    },

    async validateCredentials(email, password) {
        const user = await userRepository.findByEmail(email, true);
        if (!user) {
            const error = new Error('Invalid email or password');
            error.statusCode = 401;
            throw error;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const error = new Error('Invalid email or password');
            error.statusCode = 401;
            throw error;
        }

        return sanitizeUser(user);
    },

    async getUserById(id) {
        const user = await userRepository.findById(id);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        return sanitizeUser(user);
    },

    async getAllUsers() {
        const users = await userRepository.findAll();
        return users.map(sanitizeUser);
    },

    async updateUser(id, data) {
        // password, role, and email changes go through dedicated flows, not this one
        const disallowed = ['password', 'role', 'email'];
        disallowed.forEach((field) => delete data[field]);

        if (data.username) {
            const existing = await userRepository.findByUsername(data.username);
            if (existing && existing._id.toString() !== id) {
                const error = new Error('Username is already taken');
                error.statusCode = 409;
                throw error;
            }
        }

        const user = await userRepository.updateById(id, data);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        return sanitizeUser(user);
    },

    async changePassword(id, currentPassword, newPassword) {
        const user = await userRepository.findByIdWithPassword(id);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            const error = new Error('Current password is incorrect');
            error.statusCode = 401;
            throw error;
        }

        user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
        await user.save();

        return sanitizeUser(user);
    },

    async deleteUser(id) {
        const user = await userRepository.deleteById(id);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        return sanitizeUser(user);
    },
};

function sanitizeUser(user) {
    const obj = user.toObject ? user.toObject() : user;
    delete obj.password;
    return obj;
}

module.exports = userService;