import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICar extends Document {
  modelo: string;
  color: string;
  year: number;
  value_per_day: number;
  accessories: string[];
  number_of_passengers: number;
}

const carSchema: Schema = new Schema({
  modelo: { type: String, required: true },
  color: { type: String, required: true },
  year: { type: Number, required: true },
  value_per_day: { type: String, required: true },
  accessories: { type: [String], default: [] },
  number_of_passengers: { type: Number, required: true },
});

export const Car: Model<ICar> = mongoose.model<ICar>("Car", carSchema);
