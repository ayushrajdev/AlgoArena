export enum Images {
  Python = "python:3.10",
  "C++" = "gcc:latest",
  Typescript = "typescript",
  Java = "eclipse-temurin:11-jdk"
}

// this represent the header size of docker stream 
// docker stream header will conatain the data about type of stream i.e stdout/stderr 
// and the length of data 
export const Docker_Stream_Header_Size: number = 8;
