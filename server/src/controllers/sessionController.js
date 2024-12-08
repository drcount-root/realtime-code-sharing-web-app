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

export const deleteEmptySession = async (req, res) => {
  try {
    const sessions = await Session.find({
      code: "",
    });

    console.log(`Found ${sessions.length} empty sessions`);

    if (sessions.length === 0) {
      return res.json({ message: 'No empty sessions found to delete' });
    }

    // Delete those empty sessions
    const result = await Session.deleteMany({
      _id: { $in: sessions.map((s) => s._id) },
    });

    // Respond with the number of deleted sessions
    res.json({
      message: `Deleted ${result.deletedCount} empty session documents`,
    });
  } catch (error) {
    console.error("Error deleting empty sessions:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
