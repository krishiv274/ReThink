import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }
    const conn = await mongoose.connect(mongoUri);
    console.log(`Backend connected`);
  } catch (error: any) {
    console.error(`Backend connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
