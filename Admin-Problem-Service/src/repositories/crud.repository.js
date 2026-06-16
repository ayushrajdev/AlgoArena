export default class BaseRepository {
    constructor(model) {
        this.model = model;
    }

    async create({ data, options = {} }) {
        const result = await this.model.create([data], options);
        return result[0];
    }

    async createMany({ data, options = {} }) {
        return this.model.insertMany(data, options);
        
    }

    async findById({ id, projection = null, options = {} }) {
        return this.model.findById(id, projection, options);
    }

    async findOne({ filter = {}, projection = null, options = {} }) {
        return this.model.findOne(filter, projection, options);
    }

    async find({ filter = {}, projection = null, options = {} }) {
        return this.model.find(filter, projection, options);
    }

    async updateById({ id, update, options = {} }) {
        return this.model.findByIdAndUpdate(id, update, {
            new: true,
            runValidators: true,
            ...options,
        });
    }

    async updateOne({ filter, update, options = {} }) {
        return this.model.findOneAndUpdate(filter, update, {
            new: true,
            runValidators: true,
            ...options,
        });
    }

    async updateMany({ filter, update, options = {} }) {
        return this.model.updateMany(filter, update, options);
    }

    async deleteById({ id, options = {} }) {
        return this.model.findByIdAndDelete(id, options);
    }

    async deleteOne({ filter, options = {} }) {
        return this.model.deleteOne(filter, options);
    }

    async deleteMany({ filter, options = {} }) {
        return this.model.deleteMany(filter, options);
    }

    async count({ filter = {} }) {
        return this.model.countDocuments(filter);
    }

    async exists({ filter = {} }) {
        return this.model.exists(filter);
    }

    async aggregate({ pipeline = [], options = {} }) {
        return this.model.aggregate(pipeline, options);
    }

    async bulkWrite({ operations = [], options = {} }) {
        return this.model.bulkWrite(operations, options);
    }
}
