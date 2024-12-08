import express from "express";
import {
  createSession,
  getSessionCode,
  deleteEmptySession
} from "../controllers/sessionController.js";

const router = express.Router();

router.post("/create", createSession);
router.get("/code/:sessionId", getSessionCode);
router.delete("/delete", deleteEmptySession)

export default router;
