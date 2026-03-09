import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import bcrypt from "bcryptjs";

dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        let admin = await User.findOne({ email: "admin@jobconnect.com" });
        if (!admin) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash("admin123", salt);
            admin = await User.create({
                name: "Super Admin",
                email: "admin@jobconnect.com",
                password: hashedPassword,
                role: "admin"
            });
            console.log("Admin account created.");
        } else {
            console.log("Admin account already exists.");
        }

        // Also fix the undefined and default user
        await User.updateOne({ email: "andy@gmail.com" }, { role: "admin" });

        console.log("Made andy@gmail.com an admin.");

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
