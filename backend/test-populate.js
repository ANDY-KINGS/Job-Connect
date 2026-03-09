import mongoose from "mongoose";
import dotenv from "dotenv";
import Job from "./models/Job.js";
import User from "./models/User.js"; // NEEDED FOR POPULATE

dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const jobs = await Job.find().lean();
        
        let invalidCount = 0;
        for (const job of jobs) {
            // Test if populate would fail because employer is invalid
            if (job.employer && !mongoose.Types.ObjectId.isValid(job.employer)) {
                console.log(`Job ${job._id} has INVALID employer ID: ${job.employer}`);
                invalidCount++;
            }
            if (job.createdBy && !mongoose.Types.ObjectId.isValid(job.createdBy)) {
                console.log(`Job ${job._id} has INVALID createdBy ID: ${job.createdBy}`);
                invalidCount++;
            }
        }
        
        console.log(`Found ${invalidCount} invalid references.`);

        try {
            await Job.find().populate("employer", "name email").populate("createdBy", "name email role");
            console.log("Populate success!");
        } catch (err) {
            console.log("Populate failed!", err.message);
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
