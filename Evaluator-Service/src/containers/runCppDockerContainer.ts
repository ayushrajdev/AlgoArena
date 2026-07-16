    // import ContainerFactory from "./containerFactory.js";
    // import { Images } from "../utils/constants.js";
    // import { deodeDockerStream } from "./dockerHelper.js";

    // export default async function runCppDockerContainer({
    //     code,
    //     inputTestCase,
    // }: {
    //     code: string;
    //     inputTestCase: string;
    // }) {
    //     console.log("initializing a new docker container");

    //     var rawLogBuffer: Buffer[] = [];
    //     try {
    //         const cppDockerContainer = await ContainerFactory.createContainer({
    //             image: Images["C++"],
    //             cmdExecutable: [
    //                 "/bin/sh",
    //                 "-c",
    //                 `echo '${code.replace(/'/g, `'\\"`)}' > main.cpp && g++ main.cpp -o main && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | stdbuf -oL -eL ./main`,
    //             ],
    //         });
            
    //         // starting/booting the python container
    //         await cppDockerContainer.start();

    //         const loggerStream = await cppDockerContainer.logs({
    //             stderr: true,
    //             stdout: true,
    //             timestamps: false,
    //             follow: true, // wheather the logs are streamed or returned as single string
    //         });

    //         //we can attach events on stream object tob start and stop reading
    //         loggerStream.on("data", async (chunk) => {
    //             rawLogBuffer.push(chunk);
    //         });

    //         await new Promise((resolve, reject) => {
    //             loggerStream.on("end", async (chunk) => {
    //                 const combinedBuffer = Buffer.concat(rawLogBuffer);
    //                 // console.log(combinedBuffer);
    //                 const decodedStream = deodeDockerStream(combinedBuffer);
    //                 // console.log(decodedStream);
    //                 console.log(decodedStream);
    //                 resolve(decodedStream);
    //             });
    //         });

    //         await cppDockerContainer.remove();
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
