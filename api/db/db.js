import mongoose from "mongoose";
import env from "dotenv";

env.config();

const URI=process.env.MONGO_URI;

const connectDB=async()=>{
    try {
        await mongoose.connect(URI);
        console.log("DB connected successfully");
    } catch (error) {
        console.log("DB Connection Failed",error);
        process.exit(0);
    }
};

export default connectDB;