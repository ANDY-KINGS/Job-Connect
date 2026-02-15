import Application from "../models/Application.js";
import Job from "../models/Job.js";

export const createApplication = async (req, res) => {
    try {
        // Step 1: Verify user is authenticated (handled by protect middleware)
        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required. Please log in to apply for jobs."
            });
        }

        // Step 2: Verify role is user/jobseeker
        if (!['user', 'jobseeker'].includes(req.user.role)) {
            return res.status(403).json({
                message: "Access denied. Only users with 'user' or 'jobseeker' role can apply for jobs.",
                currentRole: req.user.role
            });
        }

        // Get job_id from request body
        const { job_id } = req.body;

        // Validate job_id is provided
        if (!job_id) {
            return res.status(400).json({ message: "job_id is required" });
        }

        // Step 3: Validate job exists
        const job = await Job.findById(job_id);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Check if job is active
        if (job.status !== 'active') {
            return res.status(400).json({ message: "This job is no longer accepting applications" });
        }

        // Step 4: Check if application already exists
        const existingApplication = await Application.findOne({
            user_id: req.user._id,
            job_id: job_id
        });

        if (existingApplication) {
            // Step 5a: If exists → return error
            return res.status(400).json({
                message: "Already applied"
            });

        }

        // Step 5b: Else → insert application
        const application = await Application.create({
            user_id: req.user._id,
            job_id: job_id,
            status: "pending"
        });

        // Populate the application with job and user details for response
        await application.populate('job_id', 'title company location');
        await application.populate('user_id', 'name email');

        // Return success response
        res.status(201).json({
            message: "Application submitted",
            application: application
        });

    } catch (error) {
        console.error('❌ Create application error:');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Stack trace:', error.stack);

        // Handle duplicate key error (unique constraint violation)
        if (error.code === 11000) {
            return res.status(400).json({
                message: "Already applied"
            });

        }

        // Handle validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: "Validation failed",
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        // Handle invalid ObjectId
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: "Invalid job ID format" });
        }

        // Generic server error response
        res.status(500).json({
            message: "Server error during application submission. Please try again later.",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const checkApplication = async (req, res) => {
    try {
        // Get current user from session (handled by protect middleware)
        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const { jobId } = req.params;

        // Validate jobId is provided
        if (!jobId) {
            return res.status(400).json({ message: "Job ID is required" });
        }

        // Check if application exists for this user and job
        const existingApplication = await Application.findOne({
            user_id: req.user._id,
            job_id: jobId
        });

        // Return simple boolean response
        res.json({
            applied: !!existingApplication
        });

    } catch (error) {
        console.error('❌ Check application error:', error);

        // Handle invalid ObjectId
        if (error.kind === 'ObjectId') {
            return res.json({ applied: false });
        }

        // Generic error - return false to be safe
        res.status(500).json({
            message: "Server error",
            applied: false
        });
    }
};

export const getUserApplications = async (req, res) => {
    try {
        // Step 1: Get authenticated user from session/token
        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        // Step 2: Fetch applications where user_id = current user
        // Step 3: Populate ('join') job details
        const applications = await Application.find({ user_id: req.user._id })
            .populate({
                path: 'job_id',
                select: 'title company location salary jobType status'
            })
            .sort({ createdAt: -1 });

        // Return the list of applications
        res.json({
            count: applications.length,
            applications
        });

    } catch (error) {
        console.error('❌ Get user applications error:', error);
        res.status(500).json({
            message: "Server error while fetching your applications"
        });
    }
};

export const getJobApplications = async (req, res) => {
    try {
        const { jobId } = req.params;

        // Step 1: Verify job exists and belongs to the employer
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Check ownership (be robust against missing employer field/legacy data)
        const jobEmployerId = job.employer?.toString() || job.postedBy?.toString();
        const userId = req.user._id.toString();

        if (!jobEmployerId || jobEmployerId !== userId) {
            return res.status(403).json({
                message: "Access denied. You can only view applications for your own jobs."
            });
        }




        // Step 2: Fetch applications for this job
        // Step 3: Populate user details
        const applications = await Application.find({ job_id: jobId })
            .populate('user_id', 'name email')
            .sort({ createdAt: -1 });

        res.json({
            count: applications.length,
            applications
        });

    } catch (error) {
        console.error('❌ Get job applications error:', error);
        res.status(500).json({
            message: "Server error while fetching job applications",
            error: error.message
        });
    }
};

export const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Step 1: Validate status
        const allowedStatuses = ['reviewed', 'accepted', 'rejected', 'pending'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}`
            });
        }

        // Step 2: Find application and populate job to check ownership
        const application = await Application.findById(id).populate('job_id');
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        const job = application.job_id;
        if (!job) {
            return res.status(404).json({ message: "Associated job not found" });
        }

        // Step 3: Verify ownership
        const jobEmployerId = job.employer?.toString() || job.postedBy?.toString();
        const userId = req.user._id.toString();

        if (!jobEmployerId || jobEmployerId !== userId) {
            return res.status(403).json({
                message: "Access denied. You can only update applications for your own jobs."
            });
        }

        // Step 4: Update status
        application.status = status;
        await application.save();

        res.json({
            message: `Application status updated to ${status}`,
            application: {
                _id: application._id,
                status: application.status,
                job_id: application.job_id._id,
                user_id: application.user_id
            }
        });

    } catch (error) {
        console.error('❌ Update application status error:', error);
        res.status(500).json({
            message: "Server error while updating application status",
            error: error.message
        });
    }
};
