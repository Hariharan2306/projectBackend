import { model, Schema } from "mongoose";

interface TokenData extends Document {
  refreshToken: string;
  userName: string;
  userType: "Reciever" | "Donor";
  userLocation: string;
  expiresAt: Date;
}

const tokenSchema: Schema = new Schema(
  {
    refreshToken: { type: String, unique: true },
    userName: { type: String, unique: true },
    userType: { type: String },
    userLocation: { type: String },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
  },
  { versionKey: false, timestamps: true }
);

const tokenModel = model<TokenData>("tokenModel", tokenSchema, "tokens");
export default tokenModel;
