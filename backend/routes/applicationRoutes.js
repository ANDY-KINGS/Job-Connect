import express from "express";
import { createApplication, checkApplication, getUserApplications, getJobApplications, updateApplicationStatus } from "../controllers/applicationController.js";



import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/applications/check/:jobId - Check if user has applied for a job
router.get("/check/:jobId", protect, authorize('user', 'jobseeker'), checkApplication);

// GET /api/applications/my - Get applications for the authenticated user
router.get("/my", protect, authorize('user', 'jobseeker'), getUserApplications);


// GET /api/applications/job/:jobId - Get applications for a specific job (Employer only)
router.get("/job/:jobId", protect, authorize('employer'), getJobApplications);

// PATCH /api/applications/:id/status - Update application status (Employer only)
router.patch("/:id/status", protect, authorize('employer'), updateApplicationStatus);




// POST /api/applications - Submit a job application
router.post("/", protect, authorize('user', 'jobseeker'), createApplication);

export default router;
