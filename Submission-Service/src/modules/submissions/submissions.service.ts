import { Injectable } from '@nestjs/common';
import CreateSubmissionDto from './dto/create-submission-dto';
import submissionQueueProducer from '../../producers/submissionQueueProducer';
import { SubmissionsRepository } from './submisions.repository';

@Injectable()
export class SubmissionsService {
    constructor(
        private readonly submissionsRepository: SubmissionsRepository,
    ) {}

    async createSubmission(createSubmissionDto: CreateSubmissionDto) {
        submissionQueueProducer({
            payload: createSubmissionDto as unknown as Record<string, unknown>,
        });

        await this.submissionsRepository.create(createSubmissionDto);
    }
}
