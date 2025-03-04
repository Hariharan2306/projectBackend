import mongoose, { Document, Schema } from "mongoose";

interface UserData extends Document {
  userId: string;
  userName: string;
  password: string;
  mobile: string;
  location: string;
  email: string;
  reciever: boolean;
  orgId: string | null;
  createdAt: Date;
}

const usersSchema: Schema = new Schema(
  {
    userId: { type: String, unique: true },
    userName: { type: String, unique: true },
    password: { type: String },
    mobile: { type: String },
    location: { type: String },
    email: { type: String },
    reciever: { type: Boolean },
    orgId: { type: String },
  },
  { versionKey: false, timestamps: true }
);

export default mongoose.model<UserData>("usersModel", usersSchema, "users");
