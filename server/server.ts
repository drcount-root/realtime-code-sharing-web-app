import express, { Request, Response } from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import shortid from "shortid";
import mongoose from "mongoose";
import { setInterval } from "timers";

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://dexterXXX:FRzdtS5fugquPQrx@cluster0.oxujkaw.mongodb.net/codeDB"
);

// Define Mongoose Schema
const sessionSchema = new mongoose.Schema({
  sessionId: String,
  code: String,
});

// Create Mongoose Model
const Session = mongoose.model("Session", sessionSchema);

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

interface CachedSession {
  [key: string]: string;
}

let cachedSessions: CachedSession = {};

// Function to save cached data to the database
const saveToDB = async () => {
  for (const sessionId in cachedSessions) {
    const code = cachedSessions[sessionId];
    await Session.findOneAndUpdate({ sessionId }, { code });
  }
};

// Cache cleanup and database sync every 9 seconds
setInterval(saveToDB, 9000);

app.post("/api/create", async (req: Request, res: Response) => {
  const sessionId = shortid.generate();
  const session = new Session({ sessionId, code: "" });
  await session.save();
  cachedSessions[sessionId] = "";
  res.json({ sessionId });
});

app.get("/api/code/:sessionId", async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const code = cachedSessions[sessionId] || "";
  res.json({ code });
});

io.on("connection", (socket) => {
  let sessionId: string;

  socket.on("join", async (id: string) => {
    sessionId = id;
    socket.join(sessionId);
    const session = await Session.findOne({ sessionId });
    if (session) {
      cachedSessions[sessionId] = session.code || "";
      socket.emit("codeUpdate", session.code);
    }
  });

  socket.on("codeChange", (code: string) => {
    cachedSessions[sessionId] = code;
    socket.to(sessionId).emit("codeUpdate", code);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const PORT = 8001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});