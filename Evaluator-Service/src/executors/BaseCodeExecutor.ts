import type IDockerStreamOutput from "../types/dockerStreamOutput.js";
import ContainerFactory from "../factories/ContainerFactory.js";
import { deodeDockerStream } from "../containers/dockerHelper.js";

export default abstract class BaseCodeExecutor {
    abstract image: string;
    abstract buildCommand(code: string, inputTestCase: string): string;

    async fetchDecodedStream(
        loggerStream: NodeJS.ReadableStream,
        rawLogBuffer: Buffer[]
    ): Promise<IDockerStreamOutput> {
        return await new Promise((resolve, reject) => {
            loggerStream.on("end", async (chunk) => {
                const combinedBuffer = Buffer.concat(rawLogBuffer);
                const decodedStream = deodeDockerStream(combinedBuffer);
                resolve(decodedStream);
            });
        });
    }

    async execute({ code, inputTestCase }: { code: string; inputTestCase: string }): Promise<any> {
        var rawLogBuffer: Buffer[] = [];
        const cmd = this.buildCommand(code,inputTestCase)
        const languageDockerContainer = await ContainerFactory.createContainer({
            image: this.image,
            cmdExecutable: [
                "/bin/sh",
                "-c",
                cmd,
            ],
        });
        try {
            // starting/booting the python container
            await languageDockerContainer.start();

            const loggerStream = await languageDockerContainer.logs({
                stderr: true,
                stdout: true,
                timestamps: false,
                follow: true, // wheather the logs are streamed or returned as single string
            });

            //we can attach events on stream object tob start and stop reading
            loggerStream.on("data", async (chunk) => {
                rawLogBuffer.push(chunk);
            });

            const response: IDockerStreamOutput = await this.fetchDecodedStream(
                loggerStream,
                rawLogBuffer
            );

            return response;
        } catch (error) {
            console.log(error);
        } finally {
            await languageDockerContainer.remove();
        }
    }
}
