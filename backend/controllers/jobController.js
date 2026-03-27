import Job from "../models/Job.js";

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'active' })
      .populate('employer', 'name')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    console.error('❌ Get all jobs error:', error);
    res.status(500).json({ message: "Server error during job retrieval" });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
  } catch (error) {
    console.error('❌ Get job by ID error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(500).json({ message: "Server error during job retrieval" });
  }
};

export const createJob = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required. Please log in to create jobs."
      });
    }

    // Check if user has employer role
    if (req.user.role !== 'employer') {
      return res.status(403).json({
        message: "Access denied. Only users with 'employer' role can create jobs.",
        currentRole: req.user.role
      });
    }

    // Destructure job data from request body
    const { title, description, location, company, jobType, salary, status } = req.body;


    // Validate required fields
    if (!title || !description || !location || !company) {
      return res.status(400).json({ message: "Title, description, location, and company are required" });
    }

    // Create job with employer ID from authenticated user
    const job = await Job.create({
      title,
      description,
      location,
      company,
      jobType: jobType || 'full-time',
      salary: salary || 'Competitive',
      status: status || 'active',

      employer: req.user._id, // Attach employer ID from authenticated user
      createdBy: req.user._id, // Track who created this job
    });


    // Return the created job
    res.status(201).json(job);
  } catch (error) {
    // Log full error details to console for debugging
    console.error('❌ Create job error:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Stack trace:', error.stack);

    // Handle specific error types
    if (error.name === 'ValidationError') {
      // Mongoose validation error
      return res.status(400).json({
        message: "Validation failed",
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    // Generic server error response
    res.status(500).json({
      message: "Server error during job creation. Please try again later.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getMyJobs = async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: "Only employers can view their jobs" });
    }

    const jobs = await Job.find({ employer: req.user._id });
    res.json(jobs);
  } catch (error) {
    console.error('❌ Get jobs error:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({
      message: "Server error during job retrieval",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const updateJob = async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: "Only employers can update jobs" });
    }

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only update your own jobs" });
    }

    const { title, description, location, status, company, jobType, salary } = req.body;

    job.title = title || job.title;
    job.description = description || job.description;
    job.location = location || job.location;
    job.status = status || job.status;
    job.company = company || job.company;
    job.jobType = jobType || job.jobType;
    job.salary = salary || job.salary;

    // Backfill createdBy for old jobs that predate this field
    if (!job.createdBy) {
      job.createdBy = job.employer;
    }

    await job.save();


    res.json(job);
  } catch (error) {
    console.error('❌ Update job error:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Stack trace:', error.stack);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: "Validation failed",
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      message: "Server error during job update",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const deleteJob = async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: "Only employers can delete jobs" });
    }

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own jobs" });
    }

    await job.deleteOne();
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error('❌ Delete job error:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({
      message: "Server error during job deletion",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
