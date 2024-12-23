import mongoose from "mongoose";

export const connectToDatabase = async () => {
  try {
    const url = process.env.DB_HOST || "";
    await mongoose.connect(url);
    console.log("Database connection Success ");
  } catch (e) {
    console.log(`Failed while connecting database ${e}`);
    process.exit(1);
  }
};
