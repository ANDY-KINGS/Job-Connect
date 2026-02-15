import express from "express";
import { getAllJobsAdmin } from "../controllers/adminViewJobsController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, authorize('admin'), getAllJobsAdmin);

export default router;
