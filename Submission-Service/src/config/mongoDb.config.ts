import mongoose from "mongoose";

export function connectMongoDb() {
   return mongoose.connect("mongodb://localhost:27017/leetcode")
}

export function disConnectMongoDb() {
    return mongoose.disconnect()
}