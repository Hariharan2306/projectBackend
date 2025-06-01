import { Document, model, Schema } from "mongoose";

interface RequestData extends Document {
  requestId: string;
  donationId: string;
  requestedBy: string;
  requesterMail: string;
  donorName: string;
  quantity: number;
  withdrawn: boolean;
  accepted: boolean;
}

const requestSchema: Schema = new Schema(
  {
    requestId: { type: String, unique: true },
    donationId: { type: String },
    requestedBy: { type: String },
    requesterMail: { type: String },
    donorName: { type: String },
    quantity: { type: Number },
    withdrawn: { type: Boolean, default: false },
    approvalStatus: { type: String, default: "Pending" },
  },
  { versionKey: false, timestamps: true }
);

const requestModel = model<RequestData>(
  "requestModel",
  requestSchema,
  "requests"
);

export default requestModel;
