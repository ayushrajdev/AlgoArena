import ContainerFactory from "./containerFactory.js";
import { Images } from "../utils/constants.js";
import { deodeDockerStream } from "./dockerHelper.js";

export default async function runPythonContainer({
    code,
    inputTestCase,
}: {
    code: string;
    inputTestCase: string;
}) {
    console.log("initializing a new docker container");

    var rawLogBuffer: Buffer[] = [];
    try {
        // const pythonDockerContainer = await ContainerFactory.createContainer({
        //     image: Images.Python,
        //     cmdExecutable: ["python3", "-c", code, "stty -echo"],
        // });
        // const pythonDockerContainer = await ContainerFactory.createContainer({
        //     image: Images.Python,
        //     cmdExecutable: [
        //         "echo",
        //         code,
        //         "> test.py && echo",
        //         inputTestCase,
        //         "|",
        //         "python3 test.py",
        //     ],
        // });

        const pythonDockerContainer = await ContainerFactory.createContainer({
            image: Images.Python,
            cmdExecutable: [
                "/bin/sh",
                "-c",
                `echo '${code.replace(/'/g, `'\\"`)}' > test.py && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | python3 test.py`,
            ],
        });
        // starting/booting the python container
        await pythonDockerContainer.start();

        const loggerStream = await pythonDockerContainer.logs({
            stderr: true,
            stdout: true,
            timestamps: false,
            follow: true, // wheather the logs are streamed or returned as single string
        });

        //we can attach events on stream object tob start and stop reading
        loggerStream.on("data", async (chunk) => {
            rawLogBuffer.push(chunk);
        });

        await new Promise((resolve, reject) => {
            loggerStream.on("end", async (chunk) => {
                const combinedBuffer = Buffer.concat(rawLogBuffer);
                // console.log(combinedBuffer);
                const decodedStream = deodeDockerStream(combinedBuffer);
                // console.log(decodedStream);
                console.log(decodedStream);
                resolve(decodedStream)
            });
        });

        await pythonDockerContainer.remove()

        return pythonDockerContainer;
    } catch (error) {
        console.log(error);
    }
}
