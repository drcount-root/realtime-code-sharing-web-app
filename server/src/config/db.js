import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("\n✅ Connected to MongoDB\n");
  } catch (error) {
    console.error("\n❌ Error connecting to MongoDB:", error, "\n");
    process.exit(1);
  }
};
