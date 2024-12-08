import express from "express";
import {
  createSession,
  getSessionCode,
} from "../controllers/sessionController.js";

const router = express.Router();

router.post("/create", createSession);
router.get("/code/:sessionId", getSessionCode);

export default router;