import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const luffy = await User.findOne({ email: "luffy@gmail.com" });
        if (luffy) {
            console.log("Luffy found:", luffy);
        } else {
            console.log("Luffy not found! Checking by name...");
            const luffyByName = await User.find({ name: /luffy/i });
            console.log("Found by name:", luffyByName);
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
