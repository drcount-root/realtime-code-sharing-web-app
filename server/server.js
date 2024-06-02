const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const shortid = require("shortid");
const mongoose = require("mongoose");

const app = express();
app.use(cors());

app.use(cors({
  origin: ["http://localhost:3000", "https://codexyz.vercel.app"]
}));

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
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.post("/api/create", async (req, res) => {
  const sessionId = shortid.generate();
  const session = new Session({ sessionId, code: "" });
  await session.save();
  res.json({ sessionId });
});

app.get("/api/code/:sessionId", async (req, res) => {
  const { sessionId } = req.params;
  const session = await Session.findOne({ sessionId });
  const code = session ? session.code : "";
  res.json({ code });
});

io.on("connection", (socket) => {
  let sessionId;

  socket.on("join", async (id) => {
    sessionId = id;
    socket.join(sessionId);
    const session = await Session.findOne({ sessionId });
    if (session) {
      socket.emit("codeUpdate", session.code);
    }
  });

  socket.on("codeChange", async (code) => {
    await Session.updateOne({ sessionId }, { code });
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