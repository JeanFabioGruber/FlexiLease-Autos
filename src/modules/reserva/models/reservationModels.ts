import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReservation extends Document {
  id_user: string;
  id_car: string;
  start_date: Date;
  end_date: Date;
  final_value: number;
}

const reservationSchema: Schema = new Schema({
  id_user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  id_car: { type: Schema.Types.ObjectId, ref: "Car", required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  final_value: { type: Number },
});

export const Reservation: Model<IReservation> = mongoose.model<IReservation>(
  "Reservation",
  reservationSchema
);
