// export type ProblemData = {
//     title: string;
//     url: string;
// }

// export type TestCase = {
//     _id: string;
//     input: string;
//     output: string;
// };

// export type CodeStub = {
//     _id: string;
//     language: string;
//     startSnippet: string;
//     midSnippet: string;
//     endSnippet: string;
// };

// export type ProblemData = {
//     _id: string;
//     title: string;
//     description: string;
//     difficulty: "easy" | "medium" | "hard";
//     testCases: TestCase[];
//     editorial: string;
//     codeStubs: CodeStub[];
// };

// problem.types.ts
export interface CodeStub {
    _id: string;
    language: string;       // "cpp" | "java" | "python"
    template: string;
}

export interface Solution {
    _id: string;
    language: string;
    code: string;
}

export interface TestCase {
    _id: string;
    input: string;
    output: string;
}

export interface ProblemData {
    _id: string;
    title: string;
    slug: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    editorial?: string;
    timeLimit: number;
    memoryLimit: number;
    tags?: string[];
    companies?: string[];
    constraints?: string[];
    notes?: string[];
    testCases?: TestCase[];
    codeStubs?: CodeStub[];
    solutions?: Solution[];
}

export interface EvaluationResponse {
    submissionId: string;
    userId: string;
    error: boolean;
    data?: string | Record<string, unknown>; // string = compiler/runtime error, object = success payload
}

export interface SubmissionResult {
    status: 'idle' | 'pending' | 'completed';
    submissionId?: string;
    isError?: boolean;
    errorMessage?: string;             // populated when isError && data is a string
    resultData?: Record<string, unknown>; // populated when !isError
    networkError?: string;             // POST itself failed (network/server down), not a judge verdict
}



export interface CodeStub {
    _id: string;
    language: string; // "cpp" | "java" | "python"
    template: string;
}

export interface Solution {
    _id: string;
    language: string;
    code: string;
}

export interface TestCase {
    _id: string;
    input: string;
    output: string;
}

export interface ProblemData {
    _id: string;
    title: string;
    slug: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    editorial?: string;
    timeLimit: number;
    memoryLimit: number;
    tags?: string[];
    companies?: string[];
    constraints?: string[];
    notes?: string[];
    testCases?: TestCase[];
    codeStubs?: CodeStub[];
    solutions?: Solution[];
}

export interface EvaluationResponse {
    submissionId: string;
    userId: string;
    error: boolean;
    data?: string | Record<string, unknown>; // string = compiler/runtime error, object = success payload
}

export interface SubmissionResult {
    status: 'idle' | 'pending' | 'completed';
    submissionId?: string;
    isError?: boolean;
    errorMessage?: string;                 // populated when isError && data is a string
    resultData?: Record<string, unknown>;  // populated when !isError
    networkError?: string;                 // the POST itself failed, not a judge verdict
}