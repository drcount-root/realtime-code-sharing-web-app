import express, { Request, Response } from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import shortid from "shortid";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

interface Sessions {
  [key: string]: string;
}

const sessions: Sessions = {}; // Store code snippets by session ID

app.post("/api/create", (req: Request, res: Response) => {
  const sessionId = shortid.generate();
  sessions[sessionId] = "";
  res.json({ sessionId });
});

app.get("/api/code/:sessionId", (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const code = sessions[sessionId] || "";
  res.json({ code });
});

io.on("connection", (socket) => {
  let sessionId: string;

  socket.on("join", (id: string) => {
    sessionId = id;
    socket.join(sessionId);
    socket.emit("codeUpdate", sessions[sessionId]);
  });

  socket.on("codeChange", (code: string) => {
    sessions[sessionId] = code;
    socket.to(sessionId).emit("codeUpdate", code);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
