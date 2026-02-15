import express from "express";
import { createJob, getMyJobs, updateJob, deleteJob, getAllJobs, getJobById } from "../controllers/jobController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllJobs);
router.get("/my-jobs", protect, authorize('employer'), getMyJobs);
router.get("/:id", getJobById);
router.post("/", protect, authorize('employer'), createJob);
router.put("/:id", protect, authorize('employer'), updateJob);
router.delete("/:id", protect, authorize('employer'), deleteJob);

export default router;
