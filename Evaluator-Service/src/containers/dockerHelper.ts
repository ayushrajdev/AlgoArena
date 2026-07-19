// import type IDockerStreamOutput from "../types/dockerStreamOutput.js";
// import { Docker_Stream_Header_Size } from "../utils/constants.js";

import type IDockerStreamOutput from "../types/dockerStreamOutput.js";

// //helps to segregate the the type of the stream that it is output stream or it is error stream
// export function deodeDockerStream(buffer: Buffer): IDockerStreamOutput {
//     console.log(buffer.toString());
    
    
//     let offset: number = 0;
//     const output: IDockerStreamOutput = { stderr: "", stdout: "" };
//     while (offset <= buffer.length) {
//         //typeOfStream is read from the buffer and has a value of type of stream
//         const typeOfStream = buffer[offset];
        

//         // as now we have read the header now we can move forward to the value of the chunk
//         // first 8 byte is the header
//         offset += Docker_Stream_Header_Size;
        

//         //this length varible hold the length of the value of the chunk not the header
//         //we will read this variable on an offset of 4 byte of the chunk
//         const lengthOfValueOfChunk = buffer.readInt32BE(offset + 4);
        

//         if (typeOfStream == 1) {
//             console.log(lengthOfValueOfChunk);
            
//             output.stdout += buffer.toString("utf8", offset, offset + lengthOfValueOfChunk);
            
//         } else if (typeOfStream == 2) {
//             output.stderr += buffer.toString("utf8", offset, offset + lengthOfValueOfChunk);
//         }

//         // move offset to next chunk 
//         offset += lengthOfValueOfChunk; 
//     }
    
//     return output;
// }



export function deodeDockerStream(buffer: Buffer): IDockerStreamOutput {
    let offset = 0;

    const output: IDockerStreamOutput = {
        stdout: "",
        stderr: "",
    };

    while (offset < buffer.length) {
        // Byte 0 tells whether this is stdout (1) or stderr (2)
        const streamType = buffer[offset];

        // Bytes 4-7 contain the payload length
        const payloadLength = buffer.readUInt32BE(offset + 4);

        // Skip the 8-byte Docker header
        offset += 8;

        // Read the actual output
        const payload = buffer.toString(
            "utf8",
            offset,
            offset + payloadLength
        );

        if (streamType === 1) {
            output.stdout += payload;
        } else if (streamType === 2) {
            output.stderr += payload;
        }

        // Move to the next Docker frame
        offset += payloadLength;
    }

    return output;
}