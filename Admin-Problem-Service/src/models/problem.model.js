import { model, Schema } from 'mongoose';

const schema = new Schema({
    title: {
        type: String,
        required: [true, 'Title cannot be empty'],
    },
    description: {
        type: String,
        required: [true, 'Description cannot be empty'],
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: [true, 'Difficulty cannot be empty'],
        default: 'easy',
    },
    testCases: [
        {
            input: {
                type: String,
                required: true,
            },
            output: {
                type: String,
                required: true,
            },
        },
    ],
    editorial: {
        type: String,
    },

    codeStubs: {
        type: [
            {
                language: String,
                startSnippet: String,
                midSnippet: String,
                endSnippet: String,
            },
        ],
    },
});

const Problem = model('problem', schema);
export default Problem;
