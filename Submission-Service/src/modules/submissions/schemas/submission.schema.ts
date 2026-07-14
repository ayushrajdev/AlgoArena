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
        enum: ['pending', 'success', 'runtime_error'],
    },
});

const Submission = model('Submission', submissionSchema);
export default Submission;
