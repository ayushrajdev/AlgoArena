import type IDockerStreamOutput from "../types/dockerStreamOutput.js";
import { Docker_Stream_Header_Size } from "../utils/constants.js";

//helps to segregate the the type of the stream that it is output stream or it is error stream
export function deodeDockerStream(buffer: Buffer): IDockerStreamOutput {
    console.log(buffer.toString());
    
    
    let offset: number = 0;
    const output: IDockerStreamOutput = { stderr: "", stdout: "" };
    while (offset <= buffer.length) {
        //typeOfStream is read from the buffer and has a value of type of stream
        const typeOfStream = buffer[offset];
        

        // as now we have read the header now we can move forward to the value of the chunk
        // first 8 byte is the header
        offset += Docker_Stream_Header_Size;
        

        //this length varible hold the length of the value of the chunk not the header
        //we will read this variable on an offset of 4 byte of the chunk
        const lengthOfValueOfChunk = buffer.readInt32BE(offset + 4);
        

        if (typeOfStream == 1) {
            console.log(lengthOfValueOfChunk);
            
            output.stdout += buffer.toString("utf8", offset, offset + lengthOfValueOfChunk);
            
        } else if (typeOfStream == 2) {
            output.stderr += buffer.toString("utf8", offset, offset + lengthOfValueOfChunk);
        }

        // move offset to next chunk 
        offset += lengthOfValueOfChunk; 
    }
    
    return output;
}
