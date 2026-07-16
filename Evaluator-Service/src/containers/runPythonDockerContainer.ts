// import ContainerFactory from "./containerFactory.js";
// import { Images } from "../utils/constants.js";
// import { deodeDockerStream } from "./dockerHelper.js";
// import type { ICodeExecutorStrategy } from "../types/CodeExecutorStrategy.js";
// import type IDockerStreamOutput from "../types/dockerStreamOutput.js";

// export default class PythonExecutor implements ICodeExecutorStrategy {
//     async fetchDecodedStream(
//         loggerStream: NodeJS.ReadableStream,
//         rawLogBuffer: Buffer[]
//     ): Promise<IDockerStreamOutput> {
//         return await new Promise((resolve, reject) => {
//             loggerStream.on("end", async (chunk) => {
//                 const combinedBuffer = Buffer.concat(rawLogBuffer);
//                 const decodedStream = deodeDockerStream(combinedBuffer);
//                 resolve(decodedStream);
//             });
//         });
//     }

//     async execute({ code, inputTestCase }: { code: string; inputTestCase: string }): Promise<any> {
//         console.log("initializing a new docker container");

//         var rawLogBuffer: Buffer[] = [];
//         const pythonDockerContainer = await ContainerFactory.createContainer({
//             image: Images.Python,
//             cmdExecutable: [
//                 "/bin/sh",
//                 "-c",
//                 `echo '${code.replace(/'/g, `'\\"`)}' > test.py && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | python3 test.py`,
//             ],
//         });
//         try {
//             // const pythonDockerContainer = await ContainerFactory.createContainer({
//             //     image: Images.Python,
//             //     cmdExecutable: ["python3", "-c", code, "stty -echo"],
//             // });
//             // const pythonDockerContainer = await ContainerFactory.createContainer({
//             //     image: Images.Python,
//             //     cmdExecutable: [
//             //         "echo",
//             //         code,
//             //         "> test.py && echo",
//             //         inputTestCase,
//             //         "|",
//             //         "python3 test.py",
//             //     ],
//             // });

//             // starting/booting the python container
//             await pythonDockerContainer.start();

//             const loggerStream = await pythonDockerContainer.logs({
//                 stderr: true,
//                 stdout: true,
//                 timestamps: false,
//                 follow: true, // wheather the logs are streamed or returned as single string
//             });

//             //we can attach events on stream object tob start and stop reading
//             loggerStream.on("data", async (chunk) => {
//                 rawLogBuffer.push(chunk);
//             });

//             const response: IDockerStreamOutput = await this.fetchDecodedStream(
//                 loggerStream,
//                 rawLogBuffer
//             );
//             // const response:IDockerStreamOutput = await new Promise((resolve, reject) => {
//             //     loggerStream.on("end", async (chunk) => {
//             //         const combinedBuffer = Buffer.concat(rawLogBuffer);
//             //         const decodedStream = deodeDockerStream(combinedBuffer);
//             //         resolve(decodedStream);
//             //     });
//             // });

//             return response;
//         } catch (error) {
//             console.log(error);
//         } finally {
//             await pythonDockerContainer.remove();
//         }
//     }
// }
