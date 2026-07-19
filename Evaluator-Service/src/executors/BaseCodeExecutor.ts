// import type IDockerStreamOutput from "../types/dockerStreamOutput.js";
// import ContainerFactory from "../factories/ContainerFactory.js";
// import { deodeDockerStream } from "../containers/dockerHelper.js";

// export default abstract class BaseCodeExecutor {
//     abstract image: string;
//     abstract buildCommand(code: string, inputTestCase: string): string;

//     async fetchDecodedStream(
//         loggerStream: NodeJS.ReadableStream,
//         rawLogBuffer: Buffer[]
//     ): Promise<IDockerStreamOutput> {
//         return await new Promise((resolve, reject) => {
//             loggerStream.on("end", async (chunk) => {
//                 const combinedBuffer = Buffer.concat(rawLogBuffer);
//                 console.log('combinedBuffer:', combinedBuffer)
//                 const decodedStream = deodeDockerStream(combinedBuffer);
//                 console.log('decodedStream:', decodedStream)
//                 resolve(decodedStream);
//             });
//         });
//     }

//     async execute({ code, inputTestCase }: { code: string; inputTestCase: string }): Promise<any> {
//         console.log("inside tge execute method of submission job handler ", {
//             code,
//             inputTestCase,
//         });
//         var rawLogBuffer: Buffer[] = [];
//         var cmd = this.buildCommand(code, inputTestCase);
//         console.log(cmd);
//         var languageDockerContainer = await ContainerFactory.createContainer({
//             image: this.image,
//             cmdExecutable: ["/bin/sh", "-c", cmd],
//         });
//         try {
//             console.log("Starting container...");
//             // starting/booting the python container
//             await languageDockerContainer.start();
//             console.log("Container started");
//             const loggerStream = await languageDockerContainer.logs({
//                 stderr: true,
//                 stdout: true,
//                 timestamps: false,
//                 follow: true, // wheather the logs are streamed or returned as single string
//             });

//             //we can attach events on stream object tob start and stop reading
//             loggerStream.on("data", async (chunk) => {
//                 console.log("Received log chunk");
//                 console.log(chunk.toString());
                
//                 rawLogBuffer.push(chunk);
//             });

//             console.log("Waiting for container to finish...");


//             console.log("Container finished");
  

//             const response: IDockerStreamOutput = await this.fetchDecodedStream(
//                 loggerStream,
//                 rawLogBuffer
//             );
//             console.log('response:', response)

//             return response;
//         } catch (error) {
//             console.log(error);
//         } finally {
//             await languageDockerContainer.remove();
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
    }: {
        code: string;
        inputTestCase: string;
    }): Promise<IDockerStreamOutput> {
        const cmd = this.buildCommand(code, inputTestCase);

        const container = await ContainerFactory.createContainer({
            image: this.image,
            cmdExecutable: ["/bin/sh", "-c", cmd],
        });

        const rawLogBuffer: Buffer[] = [];

        try {
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

            // Wait a little to ensure all logs are received
            await new Promise((resolve) => setTimeout(resolve, 20));

            const combinedBuffer = Buffer.concat(rawLogBuffer);

            const decodedOutput = deodeDockerStream(combinedBuffer);

            return decodedOutput;
        } catch (err) {
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