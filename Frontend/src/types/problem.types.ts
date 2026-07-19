// export type ProblemData = {
//     title: string;
//     url: string;
// }

export type TestCase = {
    _id: string;
    input: string;
    output: string;
};

export type CodeStub = {
    _id: string;
    language: string;
    startSnippet: string;
    midSnippet: string;
    endSnippet: string;
};

export type ProblemData = {
    _id: string;
    title: string;
    description: string;
    difficulty: "easy" | "medium" | "hard";
    testCases: TestCase[];
    editorial: string;
    codeStubs: CodeStub[];
};