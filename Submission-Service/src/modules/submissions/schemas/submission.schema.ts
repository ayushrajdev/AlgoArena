import mongoose, { model, Schema } from 'mongoose';
import { SubmissionStatus } from '../types/submissionStatus';

const submissionSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    problemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'error'],
    },
    timeLimit: {
        type: Number,
        default: 1000, // milliseconds
    },

    memoryLimit: {
        type: Number,
        default: 256, // MB
    },
});

const Submission = model('Submission', submissionSchema);
export default Submission;
