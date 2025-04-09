import mongoose, { Document, Schema } from "mongoose";

interface DonationData extends Document {
  donationId: string;
  quantity: number;
  location: string;
  time: Date;
  productType: string;
  donor: string;
  donorMail: string;
}

const donationSchema: Schema = new Schema(
  {
    donationId: { type: String, unique: true },
    quantity: { type: Number },
    location: { type: String },
    time: { type: Date },
    productType: { type: String },
    donor: { type: String },
    donorMail: { type: String },
  },
  { versionKey: false, timestamps: true }
);
const donationModel = mongoose.model<DonationData>(
  "donationModel",
  donationSchema,
  "donations"
);
export default donationModel;
