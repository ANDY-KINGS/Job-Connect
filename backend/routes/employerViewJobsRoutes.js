import express from "express";
import { getAllJobsEmployer } from "../controllers/employerViewJobsController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, authorize('employer'), getAllJobsEmployer);

export default router;
