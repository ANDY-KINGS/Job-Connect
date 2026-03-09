import axios from "axios";
import mongoose from "mongoose";
import dotenv from "dotenv";
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

        // Test the proxy port if possible, or localhost:5000 API directly to ensure no weird networking issues
        console.log("Testing API fetch via localhost:5000/api/employer/jobs");
        const res = await axios.get("http://localhost:5000/api/employer/jobs", {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log("Status:", res.status);
        console.log("Response length:", res.data.length);

        console.log("Testing API fetch via localhost:5000/employer/jobs (without /api)");
        try {
            const res2 = await axios.get("http://localhost:5000/employer/jobs", {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Status 2:", res2.status);
        } catch (err2) {
             console.log("Status 2 failed:", err2.response?.status);
        }

        process.exit(0);

    } catch (err) {
        console.error("Error making request:", err.response?.status || err.message);
        process.exit(1);
    }
};

run();
