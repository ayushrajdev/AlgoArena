// import ContainerFactory from "./containerFactory.js";
// import { Images } from "../utils/constants.js";
// import { deodeDockerStream } from "./dockerHelper.js";
// import type { ICodeExecutorStrategy } from "../types/CodeExecutorStrategy.js";
// import type IDockerStreamOutput from "../types/dockerStreamOutput.js";

// // export default async function runJavaDockerContainer({
// //     code,
// //     inputTestCase,
// // }: {
// //     code: string;
// //     inputTestCase: string;
// // }) {
// //     console.log("initializing a new docker container");

// //     var rawLogBuffer: Buffer[] = [];
// //     try {
// //         const javaDockerContainer = await ContainerFactory.createContainer({
// //             image: Images.Java,
// //             cmdExecutable: [
// //                 "/bin/sh",
// //                 "-c",
// //                 `echo '${code.replace(/'/g, `'\\"`)}' > Main.java && javac Main.java && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | java Main`,
// //             ],
// //         });
// //         // starting/booting the python container
// //         await javaDockerContainer.start();

// //         const loggerStream = await javaDockerContainer.logs({
// //             stderr: true,
// //             stdout: true,
// //             timestamps: false,
// //             follow: true, // wheather the logs are streamed or returned as single string
// //         });

// //         //we can attach events on stream object tob start and stop reading
// //         loggerStream.on("data", async (chunk) => {
// //             rawLogBuffer.push(chunk);
// //         });

// //         await new Promise((resolve, reject) => {
// //             loggerStream.on("end", async (chunk) => {
// //                 const combinedBuffer = Buffer.concat(rawLogBuffer);
// //                 // console.log(combinedBuffer);
// //                 const decodedStream = deodeDockerStream(combinedBuffer);
// //                 // console.log(decodedStream);
// //                 console.log(decodedStream);
// //                 resolve(decodedStream);
// //             });
// //         });

// //         await javaDockerContainer.remove();
// //     } catch (error) {
// //         console.log(error);
// //     }
// // }

// export class JavaExecutor implements ICodeExecutorStrategy {
//     fetchDecodedStream(
//         loggerStream: NodeJS.ReadableStream,
//         rawLogBuffer: Buffer[]
//     ): Promise<IDockerStreamOutput> {
//         throw new Error("Method not implemented.");
//     }
//     async execute({
//         code,
//         inputTestCase,
//     }: {
//         code: string;
//         inputTestCase: string;
//     }): Promise<IDockerStreamOutput> {
//         console.log("initializing a new docker container");

//         var rawLogBuffer: Buffer[] = [];
//         const javaDockerContainer = await ContainerFactory.createContainer({
//             image: Images.Java,
//             cmdExecutable: [
//                 "/bin/sh",
//                 "-c",
//                 `echo '${code.replace(/'/g, `'\\"`)}' > Main.java && javac Main.java && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | java Main`,
//             ],
//         });
//         try {
//             // starting/booting the python container
//             await javaDockerContainer.start();

//             const loggerStream = await javaDockerContainer.logs({
//                 stderr: true,
//                 stdout: true,
//                 timestamps: false,
//                 follow: true, // wheather the logs are streamed or returned as single string
//             });

//             //we can attach events on stream object tob start and stop reading
//             loggerStream.on("data", async (chunk) => {
//                 rawLogBuffer.push(chunk);
//             });

//             const response: IDockerStreamOutput = await new Promise((resolve, reject) => {
//                 loggerStream.on("end", async (chunk) => {
//                     const combinedBuffer = Buffer.concat(rawLogBuffer);
//                     // console.log(combinedBuffer);
//                     const decodedStream = deodeDockerStream(combinedBuffer);
//                     // console.log(decodedStream);
//                     console.log(decodedStream);
//                     resolve(decodedStream);
//                 });
//             });

//             return response;
//         } catch (error) {
//             console.log(error);
//             throw error;
//         } finally {
//             await javaDockerContainer.remove();
//         }
//     }
// }
