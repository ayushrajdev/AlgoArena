import { Injectable, Logger } from '@nestjs/common';
import CreateSubmissionDto from './dto/create-submission-dto';
import submissionQueueProducer from '../../producers/submissionQueueProducer';
import { SubmissionsRepository } from './submisions.repository';
import ProblemAdminServiceApi from '../../apis/problemAdminService.api';

@Injectable()
export class SubmissionsService {
    constructor(
        private readonly submissionsRepository: SubmissionsRepository,
    ) {}

    async createSubmission(createSubmissionDto: CreateSubmissionDto) {
        let timeLimit = 3000;
        let memoryLimit = 256;
        const problemDetails = await ProblemAdminServiceApi.fetchProblem(
            createSubmissionDto.problemId,
        );
        timeLimit = problemDetails.timeLimit;
        memoryLimit = problemDetails.memoryLimit;

        console.log({ timeLimit, memoryLimit, problemDetails });

        if (!problemDetails) {
            throw new Error('problem not found !! try a valid problem');
        }

        const codeStubs = problemDetails.codeStubs;
        let testCases = problemDetails.testCases;
        let inputTestCase = testCases.map((testCase) => testCase.input);
        let outputTestCase = testCases.map((testCase) => testCase.output);

        const languageCodeStubs = codeStubs.find((codeStub) => {
            return codeStub.language == createSubmissionDto.language;
        });

        createSubmissionDto.code = `${languageCodeStubs?.startSnippet ?? ''}\n${createSubmissionDto?.code ?? ''}\n${languageCodeStubs?.endSnippet ?? ''}`;

        const submissionId = await this.submissionsRepository.create(
            {
                ...createSubmissionDto,
                code: createSubmissionDto.code,
            },
            timeLimit,
            memoryLimit,
        );
        console.log({
            codeStubs,
            testCases,
            inputTestCase,
            outputTestCase,
            languageCodeStubs,
            submissionId,
            code: createSubmissionDto.code,
        });

        await submissionQueueProducer({
            payload: {
                code: createSubmissionDto.code,
                language: createSubmissionDto.language,
                problemId: createSubmissionDto.problemId,
                userId: createSubmissionDto.userId,
                inputTestCase,
                outputTestCase,
                submissionId,
                timeLimit,
                memoryLimit,
            },
        });

        return true;
    }
}
