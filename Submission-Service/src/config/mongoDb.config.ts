import mongoose from "mongoose";

export function connectMongoDb() {
   return mongoose.connect("mongodb://localhost:27017/submission")
}

export function disConnectMongoDb() {
    return mongoose.disconnect()
}