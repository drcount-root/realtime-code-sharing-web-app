import cron from "node-cron";
import Session from "../models/Session.js";

export const scheduleCronJobs = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const result = await Session.deleteMany({
        lastModified: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      });
      console.log(`Deleted ${result.deletedCount} old session documents`);
    } catch (error) {
      console.error("Error deleting old sessions:", error);
    }
  });
};

// cron.schedule("0 0 1,15 * *", async () => {
//   try {
//     const sessions = await Session.find({
//       createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
//       code: { $size: 0 },
//     });
//     const result = await Session.deleteMany({
//       _id: { $in: sessions.map((s) => s._id) },
//     });
//     console.log(`Deleted ${result.deletedCount} empty session documents`);
//   } catch (error) {
//     console.error("Error deleting empty sessions:", error);
//   }
// });
