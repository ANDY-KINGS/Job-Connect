import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import User from "./models/User.js";
import jwt from "jsonwebtoken";

dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const employer = await User.findOne({ role: "employer" });

        if (!employer) {
            console.log("No employer found in DB");
            process.exit(1);
        }

        const token = jwt.sign({ id: employer._id, role: employer.role }, process.env.JWT_SECRET, { expiresIn: "10h" });
        console.log("Employer email:", employer.email);

        const res = await axios.get("http://localhost:5000/api/jobs/my-jobs", {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log("Status:", res.status);
        console.log("Response:", res.data.length, "items");
        process.exit(0);

    } catch (err) {
        console.error("Error making request:");
        if (err.response) {
            console.error("Status:", err.response.status);
            console.error("Body:", err.response.data);
        } else {
            console.error(err.message);
        }
        process.exit(1);
    }
};

run();
