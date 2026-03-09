import mongoose from "mongoose";
import dotenv from "dotenv";
import Job from "./models/Job.js";

dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected");
        const jobs = await Job.find({}).populate("createdBy", "name email role").sort({ createdAt: -1 });
        console.log("Jobs length:", jobs.length);
        process.exit(0);
    } catch (err) {
        console.error("Error finding jobs:");
        console.error(err);
        process.exit(1);
    }
};

run();
