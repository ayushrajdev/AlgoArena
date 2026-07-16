import type IDockerStreamOutput from "./dockerStreamOutput";

export interface ICodeExecutorStrategy {
   async execute({
        code,
        inputTestCase,
    }: {
        code: string;
        inputTestCase: string;
    }): Promise<IDockerStreamOutput>;

   async fetchDecodedStream(
        loggerStream: NodeJS.ReadableStream,
        rawLogBuffer: Buffer[]
    ): Promise<IDockerStreamOutput>;

    code?:string
    language?:string
    inputTestCase?:string
    image: string;
    cmd: string;
}
