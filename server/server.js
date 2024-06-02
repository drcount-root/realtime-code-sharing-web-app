const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const shortid = require("shortid");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const sessions = {}; // Store code snippets by session ID

app.post("/api/create", (req, res) => {
  const sessionId = shortid.generate();
  sessions[sessionId] = "";
  res.json({ sessionId });
});

app.get("/api/code/:sessionId", (req, res) => {
  const { sessionId } = req.params;
  const code = sessions[sessionId] || "";
  res.json({ code });
});

io.on("connection", (socket) => {
  socket.on("join", (sessionId) => {
    socket.join(sessionId);
    socket.sessionId = sessionId;

    socket.emit("codeUpdate", sessions[sessionId]);
  });

  socket.on("codeChange", (code) => {
    const { sessionId } = socket;
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
