import mongoose, { Document, Schema, version } from "mongoose";

interface ICounter extends Document {
  field: string;
  sequenceValue: number;
}

const CounterSchema: Schema = new Schema(
  {
    field: { type: String, required: true, unique: true },
    sequenceValue: { type: Number, default: 9999 },
  },
  { versionKey: false }
);

const CounterModel = mongoose.model<ICounter>("Counter", CounterSchema);

export const getNextSequenceWithPrefix = async (
  field: string,
  prefix: string
): Promise<string> => {
  let counter = await CounterModel.findOne({ field });
  if (!counter) await CounterModel.create({ field });

  const nextSequnceValue = counter!.sequenceValue + 1;

  await CounterModel.updateOne(
    { field },
    { $set: { sequenceValue: nextSequnceValue } }
  );
  return `${prefix}${nextSequnceValue}`;
};
