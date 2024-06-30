import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  cpf: string;
  birth: String;
  email: string;
  password: string;
  cep: string;
  address: {
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
  };
  qualified: string;
}

const userSchema: Schema<IUser> = new Schema({
  name: { type: String, required: true },
  cpf: { type: String, required: true, unique: true },
  birth: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cep: { type: String, required: true },
  address: {
    logradouro: { type: String, default: "N/A" },
    complemento: { type: String, default: "N/A" },
    bairro: { type: String, default: "N/A" },
    localidade: { type: String, default: "N/A" },
    uf: { type: String, default: "N/A" },
  },
  qualified: { type: String, enum: ["sim", "não"], required: true },
});

export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
