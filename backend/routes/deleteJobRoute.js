import express from "express";
import { deleteJob } from "../controllers/deleteJobController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.delete("/:id", auth(["admin"]), deleteJob);

export default router;
