import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import jwt from "jsonwebtoken";

dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        // Create a fake admin id
        const fakeAdminId = new mongoose.Types.ObjectId();
        
        const token = jwt.sign({ id: fakeAdminId }, process.env.JWT_SECRET, { expiresIn: "10h" });
        console.log("Fake admin token generated.");

        const res = await axios.get("http://localhost:5000/api/admin/jobs", {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log("Status:", res.status);
        console.log("Response:", res.data?.length, "items");
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
