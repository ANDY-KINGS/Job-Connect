import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import adminViewJobsRoutes from "./routes/adminViewJobsRoutes.js";
import employerViewJobsRoutes from "./routes/employerViewJobsRoutes.js";
import applySecurity from "./config/security.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

/* Security Middleware */
applySecurity(app);

/* Middleware */
app.use(express.json());

/* Routes */
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin/jobs", adminViewJobsRoutes);
app.use("/api/employer/jobs", employerViewJobsRoutes);

/* Test route */
app.get("/", (req, res) => {
  res.send("Job Tracker API is running 🚀");
});

/* Error Handler (must be last) */
app.use(errorHandler);

/* Port */
const PORT = process.env.PORT || 5000;

/* MongoDB connection */
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI missing in .env");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed");
    console.error(err.message);
    process.exit(1);
  });
