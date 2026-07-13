import Docker from "dockerode";
import pullDockerImage from "./pullDockerImage.js";

type createContainer = { image: string; cmdExecutable: string[]; env?: string[] };

export default class ContainerFactory {
    constructor() {}

    static async createContainer({ image, cmdExecutable, env }: createContainer) {

        const docker = new Docker();
        await pullDockerImage(image)
        const container = await docker.createContainer({
            Image: image,
            Cmd: cmdExecutable,
            AttachStderr: true,
            AttachStdin: true, // to enable input streams
            AttachStdout: true, // to enable output strams,
            Tty: false,
            OpenStdin: true, //input stream is enabled if there is no interaction with the container
        });

        return container;
    }
}
