import Job from "../models/Job.js";

export const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        if (job.createdBy.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You can only delete jobs you created"
            });
        }

        await job.deleteOne();

        res.json({ message: "Job deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
