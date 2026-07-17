import { Injectable } from '@nestjs/common';
import Submission from './schemas/submission.schema';
import CreateSubmissionDto from './dto/create-submission-dto';
import { SubmissionStatus } from './types/submissionStatus';

@Injectable()
export class SubmissionsRepository {
    private readonly submissionSchema: typeof Submission;

    constructor() {
        this.submissionSchema = Submission;
    }

    async create(createSubmissionDto: CreateSubmissionDto) {
        return await this.submissionSchema.insertOne({
            ...createSubmissionDto,
            status: SubmissionStatus.Pending,
        });
    }
}
