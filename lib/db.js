/** @format */

import mongoose from "mongoose";

const url = process.env.MONGODB_URI;
let connected = false;

const connectToMongo = async () => {
  mongoose.set("strictQuery", true);
  if (!url) return console.log("MONGO_URL not found");
  if (connected) return console.log("Connected to MongoDB");
  try {
    await mongoose.connect(url);
    connected = true;
    console.log("New connection to MongoDB");
  } catch (err) {
    return Promise.reject(err);
  }
};

export default connectToMongo;
