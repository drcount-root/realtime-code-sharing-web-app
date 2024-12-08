import dotenv from "dotenv";
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import { handleSockets } from "./sockets/socketHandler.js";
import { scheduleCronJobs } from "./utils/cronJobs.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: [
      // process.env.DEVLOPMENT_FE_URL, 
      process.env.PRODUCTION_FE_URL],
  })
);

app.use(express.json());

// API Routes
app.use("/api/sessions", sessionRoutes);

// Create HTTP and WebSocket Server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      // process.env.DEVLOPMENT_FE_URL, 
      process.env.PRODUCTION_FE_URL],
    methods: ["GET", "POST"],
  },
});

// Handle WebSockets
handleSockets(io);

// Schedule Cron Jobs
scheduleCronJobs();

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
