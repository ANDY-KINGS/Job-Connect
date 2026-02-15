import Job from "../models/Job.js";

export const getAllJobsEmployer = async (req, res) => {
    try {
        const jobs = await Job.find()
            .populate("employer", "name email")
            .populate("createdBy", "name email role")
            .sort({ createdAt: -1 });

        res.json(jobs);

    } catch (error) {
        res.status(500).json({ message: "Failed to fetch jobs" });
    }
};
