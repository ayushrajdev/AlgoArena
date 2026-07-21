// import ContainerFactory from "../factories/ContainerFactory.js";
// import { deodeDockerStream } from "../containers/dockerHelper.js";
// import type IDockerStreamOutput from "../types/dockerStreamOutput.js";

// export default abstract class BaseCodeExecutor {
//     abstract image: string;
//     abstract buildCommand(code: string, inputTestCase: string): string;

//     async execute({
//         code,
//         inputTestCase,
//         timeLimit,
//         memoryLimit,
//     }: {
//         code: string;
//         inputTestCase: string;
//         timeLimit: number;
//         memoryLimit: number;
//     }): Promise<IDockerStreamOutput> {
//         const cmd = this.buildCommand(code, inputTestCase);

//         const container = await ContainerFactory.createContainer({
//             image: this.image,
//             cmdExecutable: ["/bin/sh", "-c", cmd],
//             memoryLimit,
//         });

//         const rawLogBuffer: Buffer[] = [];

//         try {
//             await container.start();

//             const loggerStream = await container.logs({
//                 stdout: true,
//                 stderr: true,
//                 follow: true,
//                 timestamps: false,
//             });

//             loggerStream.on("data", (chunk: Buffer) => {
//                 rawLogBuffer.push(chunk);
//             });

//             await container.wait();

//             // Wait a little to ensure all logs are received
//             await new Promise((resolve) => setTimeout(resolve, 20));

//             const combinedBuffer = Buffer.concat(rawLogBuffer);

//             const decodedOutput = deodeDockerStream(combinedBuffer);

//             return decodedOutput;
//         } catch (err) {
//             return {
//                 stdout: "",
//                 stderr: err instanceof Error ? err.message : String(err),
//             };
//         } finally {
//             try {
//                 await container.remove({ force: true });
//             } catch (err) {
//                 console.error("Failed to remove container:", err);
//             }
//         }
//     }
// }

import ContainerFactory from "../factories/ContainerFactory.js";
import { deodeDockerStream } from "../containers/dockerHelper.js";
import type IDockerStreamOutput from "../types/dockerStreamOutput.js";

export default abstract class BaseCodeExecutor {
    abstract image: string;
    abstract buildCommand(code: string, inputTestCase: string): string;

    async execute({
        code,
        inputTestCase,
        timeLimit,
        memoryLimit,
    }: {
        code: string;
        inputTestCase: string;
        timeLimit: number;
        memoryLimit: number;
    }): Promise<IDockerStreamOutput> {
        const cmd = this.buildCommand(code, inputTestCase);
        console.log(cmd);
        

        const container = await ContainerFactory.createContainer({
            image: this.image,
            cmdExecutable: ["/bin/sh", "-c", cmd],
            memoryLimit,
        });

        const rawLogBuffer: Buffer[] = [];

        try {
            const executionPromise = (async () => {
                await container.start();

                const loggerStream = await container.logs({
                    stdout: true,
                    stderr: true,
                    follow: true,
                    timestamps: false,
                });

                loggerStream.on("data", (chunk: Buffer) => {
                    rawLogBuffer.push(chunk);
                });

                await container.wait();

                // Wait a little so Docker flushes all logs
                await new Promise((resolve) => setTimeout(resolve, 20));

                const combinedBuffer = Buffer.concat(rawLogBuffer);

                return deodeDockerStream(combinedBuffer);
            })();

            const timeoutPromise = new Promise<IDockerStreamOutput>((_, reject) => {
                setTimeout(async () => {
                    try {
                        await container.kill();
                    } catch {
                        // container may have already exited
                    }

                    reject(new Error("Time Limit Exceeded"));
                }, timeLimit);
            });

            return await Promise.race([executionPromise, timeoutPromise]);
        } catch (err:any) {
            console.log(err.message);
            
            if (err instanceof Error && err.message === "Time Limit Exceeded") {
                throw err;
            }

            return {
                stdout: "",
                stderr: err instanceof Error ? err.message : String(err),
            };
        } finally {
            try {
                await container.remove({ force: true });
            } catch (err) {
                console.error("Failed to remove container:", err);
            }
        }
    }
}
