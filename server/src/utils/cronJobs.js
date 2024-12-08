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
