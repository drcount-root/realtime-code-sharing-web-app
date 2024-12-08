import Session from "../models/Session.js";

export const handleSockets = (io) => {
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
      try {
        await Session.updateOne(
          { sessionId },
          { code, lastModified: Date.now() }
        );
        socket.to(sessionId).emit("codeUpdate", code);
      } catch (error) {
        console.error("Error updating code:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};
