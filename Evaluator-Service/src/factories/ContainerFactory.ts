import Docker from "dockerode";
import pullDockerImage from "../containers/pullDockerImage.js";

type createContainer = { image: string; cmdExecutable: string[]; env?: string[] };

export default class ContainerFactory {
    constructor() {}

    static async createContainer({ image, cmdExecutable, env }: createContainer) {
        console.log("Creating Docker client...");
        const docker = new Docker();
        console.log("Listing images...");
        const images = await docker.listImages();
        const imagesArray = images
            .map((image) => image.RepoTags?.[0])
            .filter((tag): tag is string => typeof tag === "string");
        if (!imagesArray.includes(image)) {
            await pullDockerImage(image);
        }
        console.log("Creating container...");
        const container = await docker.createContainer({
            Image: image,
            Cmd: cmdExecutable,
            AttachStderr: true,
            AttachStdin: true, // to enable input streams
            AttachStdout: true, // to enable output strams,
            Tty: false,
            OpenStdin: true, //input stream is enabled if there is no interaction with the container
        });
        console.log("Container created:", container.id);

        return container;
    }
}
