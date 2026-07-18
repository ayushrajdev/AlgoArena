const User = require('./user.schema');

const userRepository = {
    async create(data) {
        return User.create(data);
    },

    async findById(id) {
        return User.findById(id);
    },

    async findByIdWithPassword(id) {
        return User.findById(id).select('+password');
    },

    async findByEmail(email, withPassword = false) {
        const query = User.findOne({ email });
        if (withPassword) query.select('+password');
        return query;
    },

    async findByUsername(username) {
        return User.findOne({ username });
    },

    async findAll(filter = {}) {
        return User.find(filter);
    },

    async updateById(id, data) {
        return User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    },

    async deleteById(id) {
        return User.findByIdAndDelete(id);
    },
};

module.exports = userRepository;