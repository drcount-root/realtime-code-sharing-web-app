import { nanoid } from "nanoid";
import Session from "../models/Session.js";

export const createSession = async (req, res) => {
  try {
    const sessionId = nanoid(10);
    const session = new Session({
      sessionId,
      code: "",
      lastModified: Date.now(),
    });
    await session.save();
    res.json({ sessionId });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const getSessionCode = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findOne({ sessionId });
    const code = session ? session.code : "";
    res.json({ code });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};