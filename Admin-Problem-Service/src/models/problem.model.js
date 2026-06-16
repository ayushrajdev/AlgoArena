import { model, Schema } from 'mongoose';

const schema = new Schema({
    title: {
        type: String,
        required: [true, 'title cannot be empty'],
    },
    description: {
        type: String,
        required: [true, 'description cannot be empty'],
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'easy',
    },
    testCases: [
        {
            input: { type: String, required: true },
            output: { type: String, required: true },
        },
    ],
});

const Problem = model('problem', schema);
export default Problem;
