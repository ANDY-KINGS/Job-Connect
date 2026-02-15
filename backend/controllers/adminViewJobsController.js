import Job from "../models/Job.js";

export const getAllJobsAdmin = async (req, res) => {
    try {
        const jobs = await Job.find()
            .populate("createdBy", "name email role")
            .sort({ createdAt: -1 });

        res.json(jobs);

    } catch (error) {
        res.status(500).json({ message: "Failed to fetch jobs" });
    }
};
