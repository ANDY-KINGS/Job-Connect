import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { getUserStats } from "../controllers/dashboardController.js";
import User from "../models/User.js";

const router = express.Router();

// GET /api/dashboard/stats - Get user dashboard statistics
router.get("/stats", protect, authorize('user', 'jobseeker'), getUserStats);

router.get("/", protect, (req, res) => {
  res.json({ message: `Welcome to your dashboard, user ${req.user.name}, role: ${req.user.role}` });
});

router.get("/admin/users", protect, authorize('admin'), async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

export default router;