import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import fs from "fs";

dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({}, "email role").lean();
        let log = "Total users: " + users.length + "\n";
        users.forEach(u => { log += `Email: ${u.email}, Role: ${u.role}\n` });
        fs.writeFileSync("users-utf8.txt", log, "utf8");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
