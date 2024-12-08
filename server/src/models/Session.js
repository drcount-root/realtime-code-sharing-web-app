import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  sessionId: String,
  code: String,
  lastModified: {
    type: Date,
    default: Date.now,
  },
});

const Session = mongoose.model("Session", sessionSchema);
export default Session;
