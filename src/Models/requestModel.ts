import { Document, model, Schema } from "mongoose";

interface RequestData extends Document {
  requestId: string;
  donationId: string;
  requestedBy: string;
  requesterMail: string;
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
    quantity: { type: Number },
    withdrawn: { type: Boolean, default: false },
    accepted: { type: Boolean, default: false },
  },
  { versionKey: false, timestamps: true }
);

const requestModel = model<RequestData>(
  "requestModel",
  requestSchema,
  "requests"
);

export default requestModel;
