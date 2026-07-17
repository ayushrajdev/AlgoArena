import { Body, Controller, Get, Post } from '@nestjs/common';
import CreateSubmissionDto from './dto/create-submission-dto';
import { SubmissionsService } from './submissions.service';
import { SuccessResponse } from '../../common/Response';

@Controller('submissions')
export class SubmissionsController {
    constructor(private readonly submissionService: SubmissionsService) {}

    @Post()
    async createSubmission(@Body() createSubmissionDto: CreateSubmissionDto) {
        try {
            const response =
                await this.submissionService.createSubmission(
                    createSubmissionDto,
                );
            return new SuccessResponse('submission created', { response });
        } catch (error) {
            console.log(error);
            return { error: true };
        }
    }
}
