import type { LanguageType } from "./language.js";

export interface ISubmissionPayload {
    code: string;
    language: LanguageType;
    inputTestCase: string[];
    outputTestCase: string[];

    problemId?: string;
    userId?: string;
    submissionId?: string;

    timeLimit,
    memoryLimit,
}
