import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        job_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "reviewed", "accepted", "rejected"],
            default: "pending",
        },

    },
    {
        timestamps: true // This adds createdAt and updatedAt automatically
    }
);

// Add unique compound index to prevent duplicate applications
ApplicationSchema.index({ user_id: 1, job_id: 1 }, { unique: true });

export default mongoose.model("Application", ApplicationSchema);
